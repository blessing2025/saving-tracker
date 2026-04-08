import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PieChart, TrendingUp, Wallet, Target } from 'lucide-react'

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)

  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', user.id)

  const totalSaved = goals?.reduce((acc, goal) => acc + goal.current_amount, 0) || 0
  const totalTarget = goals?.reduce((acc, goal) => acc + goal.target_amount, 0) || 0
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  const totalDeposits = transactions?.filter(t => t.type === 'deposit').reduce((acc, t) => acc + t.amount, 0) || 0
  const totalWithdrawals = transactions?.filter(t => (t.type === 'withdrawal' || t.type === 'withdraw')).reduce((acc, t) => acc + t.amount, 0) || 0

  return (
    <div className="flex flex-col gap-6 p-6 pb-24 text-slate-900">
      <header className="flex items-center gap-4">
        <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
          <PieChart size={20} />
        </div>
        <h1 className="text-xl font-bold">Insights & Reports</h1>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
          <TrendingUp className="text-emerald-600 mb-3" size={20} />
          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Total Savings</p>
          <p className="text-lg font-black text-emerald-900">UGX {totalSaved.toLocaleString()}</p>
        </div>
        <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100">
          <Target className="text-blue-600 mb-3" size={20} />
          <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Global Goal</p>
          <p className="text-lg font-black text-blue-900">{Math.round(overallProgress)}%</p>
        </div>
      </div>

      <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="text-emerald-400" size={20} />
          <h3 className="font-bold">Flow Overview</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              <span>Deposits</span>
              <span className="text-emerald-400">UGX {totalDeposits.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              <span>Withdrawals</span>
              <span className="text-red-400">UGX {totalWithdrawals.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: totalDeposits > 0 ? `${(totalWithdrawals / totalDeposits) * 100}%` : '0%' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Goal Distribution</h3>
        {goals?.map(goal => (
          <div key={goal.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="font-bold text-slate-800">{goal.title}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Target: UGX {goal.target_amount.toLocaleString()}</p>
            </div>
            <p className="text-sm font-black text-blue-600">{Math.round((goal.current_amount / goal.target_amount) * 100)}%</p>
          </div>
        ))}
      </section>
    </div>
  )
}