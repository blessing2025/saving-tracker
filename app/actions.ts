'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=' + encodeURIComponent('Please enter both email and password.'))
  }

  console.log('Login attempt:', email)

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error('Supabase Login Error:', error.message)
    const errorMessage = 
      error.message === 'Email not confirmed' 
        ? 'Please check your email and confirm your account before logging in.' 
        : error.message
        
    redirect('/login?error=' + encodeURIComponent(errorMessage))
  }

  revalidatePath('/', 'layout')
  console.log('Login successful for:', email)
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!email || !password || !fullName) {
    redirect('/register?error=Please fill in all fields')
  }

  if (password !== confirmPassword) {
    redirect('/register?error=Passwords do not match')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    redirect('/register?error=' + encodeURIComponent(error.message))
  }

  // If Email Confirmation is OFF, Supabase returns a session immediately
  if (data?.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  // If Email Confirmation is ON
  redirect('/login?message=' + encodeURIComponent('Check your email to confirm your account.'))
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function createGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const goalData = {
    user_id: user.id,
    title: formData.get('title') as string,
    target_amount: parseFloat(formData.get('target_amount') as string),
    deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string).toISOString() : null,
    status: 'active'
  }

  const { error } = await supabase.from('goals').insert(goalData)

  if (error) redirect('/goals/new?error=' + encodeURIComponent(error.message))

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function depositFunds(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const goalId = formData.get('goal_id') as string
  const amount = parseFloat(formData.get('amount') as string)
  const momoNumber = formData.get('momo_number') as string

  if (!goalId || isNaN(amount) || amount <= 0) {
    redirect(`/deposit/${goalId}?error=` + encodeURIComponent('Invalid deposit details'))
  }

  // 1. Fetch current goal progress
  const { data: goal, error: goalError } = await supabase
    .from('goals')
    .select('current_amount, target_amount')
    .eq('id', goalId)
    .single()

  if (goalError || !goal) redirect(`/deposit/${goalId}?error=Goal not found`)

  // 2. Prevent over-depositing
  const remaining = goal.target_amount - goal.current_amount
  if (amount > remaining) {
    redirect(`/deposit/${goalId}?error=` + encodeURIComponent(`Deposit exceeds target. You only need XAF ${remaining.toLocaleString()} more.`))
  }

  // 3. Record the transaction
  const { error: txError } = await supabase.from('transactions').insert({
    user_id: user.id,
    goal_id: goalId,
    amount: amount,
    momo_number: momoNumber,
    type: 'deposit',
    status: 'completed'
  })

  if (txError) redirect(`/deposit/${goalId}?error=` + encodeURIComponent(txError.message))

  // 4. Update the goal balance and check for completion
  const newAmount = goal.current_amount + amount
  const { error: updateError } = await supabase
    .from('goals')
    .update({ 
      current_amount: newAmount,
      status: newAmount >= goal.target_amount ? 'completed' : 'active'
    })
    .eq('id', goalId)

  if (updateError) redirect(`/deposit/${goalId}?error=` + encodeURIComponent(updateError.message))

  revalidatePath(`/goals/${goalId}`)
  revalidatePath('/dashboard')
  redirect(`/goals/${goalId}`)
}

export async function withdrawFunds(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const goalId = formData.get('goal_id') as string
  const amount = parseFloat(formData.get('amount') as string)
  const momoNumber = formData.get('momo_number') as string

  if (!goalId || isNaN(amount) || amount <= 0) {
    redirect(`/withdraw/${goalId}?error=` + encodeURIComponent('Invalid withdrawal details'))
  }

  // 1. Fetch current goal balance to verify funds
  const { data: goal, error: goalError } = await supabase
    .from('goals')
    .select('current_amount, target_amount')
    .eq('id', goalId)
    .single()

  if (goalError || !goal) redirect(`/withdraw/${goalId}?error=` + encodeURIComponent('Goal not found'))

  // 2. Prevent withdrawing more than available
  if (amount > goal.current_amount) {
    redirect(`/withdraw/${goalId}?error=` + encodeURIComponent(`Insufficient funds. You only have UGX ${goal.current_amount.toLocaleString()} saved.`))
  }

  const { error: txError } = await supabase.from('transactions').insert({
    user_id: user.id,
    goal_id: goalId,
    amount: amount,
    momo_number: momoNumber,
    type: 'withdrawal',
    status: 'completed'
  })

  if (txError) redirect(`/withdraw/${goalId}?error=` + encodeURIComponent(txError.message))

  // Update the goal balance and status
  const newAmount = goal.current_amount - amount
  const { error: updateError } = await supabase
    .from('goals')
    .update({ 
      current_amount: newAmount,
      status: newAmount >= goal.target_amount ? 'completed' : 'active'
    })
    .eq('id', goalId)

  if (updateError) redirect(`/withdraw/${goalId}?error=` + encodeURIComponent(updateError.message))

  revalidatePath(`/goals/${goalId}`)
  revalidatePath('/dashboard')
  redirect(`/goals/${goalId}?message=` + encodeURIComponent('Withdrawal successful!'))
}

export async function deleteGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const goalId = formData.get('goal_id') as string

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', user.id)

  if (error) redirect(`/goals/${goalId}?error=` + encodeURIComponent(error.message))

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const fullName = formData.get('full_name') as string

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  })

  if (error) redirect('/profile?error=' + encodeURIComponent(error.message))

  revalidatePath('/profile', 'layout')
  revalidatePath('/dashboard')
  redirect('/profile?message=' + encodeURIComponent('Profile updated successfully!'))
}