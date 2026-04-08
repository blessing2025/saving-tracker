import { ArrowLeft, Wallet, Smartphone, Landmark } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { withdrawFunds } from '@/app/actions'

export default async function WithdrawPage(props: { 
  params: Promise<{ id: string }>, 
  searchParams: Promise<{ error?: string }> 
}) {
  const { id } = await props.params;
  const { error } = await props.searchParams;
  const supabase = await createClient()

  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('id', id)
    .single()

  if (!goal) return notFound()

  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 text-slate-900">
      <header className="flex items-center gap-4 mb-8">
        <Link href={`/goals/${id}`} className="p-2 bg-slate-100 rounded-xl text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">Withdraw Funds</h1>
      </header>

      <div className="mb-8 p-6 bg-red-50 rounded-3xl border border-red-100">
        <p className="text-xs font-bold text-red-600 uppercase mb-1">Available to Withdraw</p>
        <h2 className="text-2xl font-black text-red-900">UGX {goal.current_amount.toLocaleString()}</h2>
        <p className="text-sm text-red-700 mt-1">Goal: {goal.title}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl text-center">
          {error}
        </div>
      )}

      <form action={withdrawFunds} className="space-y-6">
        <input type="hidden" name="goal_id" value={id} />
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Withdrawal Amount (UGX)</label>
          <div className="relative">
            <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="amount"
              type="number" 
              placeholder="Enter amount"
              required
              max={goal.current_amount}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-red-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Receive on Momo Number</label>
          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="momo_number"
              type="tel" 
              placeholder="07XX XXX XXX"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-red-500 transition-all"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Wallet size={18} />
            <span className="text-xs font-bold uppercase tracking-wide">Destination</span>
          </div>
          <p className="text-sm font-medium text-slate-700">MTN / Airtel Mobile Money</p>
        </div>

        <button className="w-full py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-100 mt-4">
          Confirm Withdrawal
        </button>
      </form>
    </div>
  )
}