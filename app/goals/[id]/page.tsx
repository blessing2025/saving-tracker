import { ArrowLeft, Plus, Minus, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { deleteGoal } from '@/app/actions'

export default async function GoalDetailsPage(props: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const { id } = await props.params;
  const { message, error } = await props.searchParams;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('id', id)
    .single()

  if (!goal) return notFound()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('goal_id', id)
    .order('created_at', { ascending: false })

  const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100)

  return (
    <div className="flex flex-col gap-6 p-6 pb-24 text-slate-900">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-slate-100 rounded-xl text-slate-500"><ArrowLeft size={20} /></Link>
          <h1 className="text-xl font-bold">Goal Details</h1>
        </div>
        <form action={deleteGoal}>
          <input type="hidden" name="goal_id" value={id} />
          <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <Trash2 size={20} />
          </button>
        </form>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl text-center">
          {error}
        </div>
      )}

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium rounded-2xl text-center">
          {message}
        </div>
      )}

      <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] text-center shadow-sm">
        <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">{goal.title}</h2>
        <div className="text-4xl font-black mb-6">
          <span className="text-2xl text-slate-300 mr-1 font-medium">XAF</span>{goal.current_amount.toLocaleString()}
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          <span>{Math.round(progress)}% Completed</span>
          <span>Target: {goal.target_amount.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href={`/deposit/${id}`} className="flex flex-col items-center gap-2 p-6 bg-emerald-50 rounded-[2rem] text-emerald-600 font-bold">
          <div className="p-3 bg-white rounded-2xl shadow-sm"><Plus size={24} /></div>
          Deposit
        </Link>
        <Link href={`/withdraw/${id}`} className="flex flex-col items-center gap-2 p-6 bg-red-50 rounded-[2rem] text-red-600 font-bold">
          <div className="p-3 bg-white rounded-2xl shadow-sm"><Minus size={24} /></div>
          Withdraw
        </Link>
      </div>

      <section>
        <h3 className="text-lg font-bold mb-4">Activity</h3>
        <div className="space-y-4">
          {transactions?.length === 0 ? (
            <p className="text-center py-10 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">No transactions yet</p>
          ) : (
            transactions?.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {tx.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 capitalize">{tx.type}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`text-right font-black ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {tx.type === 'deposit' ? '+' : '-'} {tx.amount.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
