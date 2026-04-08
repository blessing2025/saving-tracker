import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowUpRight, ArrowDownLeft, History } from 'lucide-react'

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, goals(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6 p-6 pb-24 text-slate-900">
      <header className="flex items-center gap-4">
        <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
          <History size={20} />
        </div>
        <h1 className="text-xl font-bold">Transaction History</h1>
      </header>

      <div className="space-y-4">
        {!transactions || transactions.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No transactions found</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {tx.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800 capitalize">{tx.type}</p>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold uppercase">
                      {tx.goals?.title || 'General'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {new Date(tx.created_at).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {tx.type === 'deposit' ? '+' : '-'} {tx.amount.toLocaleString()}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">{tx.momo_number}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
