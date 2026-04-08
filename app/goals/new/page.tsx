import { ArrowLeft, Target, DollarSign, Calendar } from 'lucide-react'
import Link from 'next/link'
import { createGoal } from '@/app/actions'

export default async function NewGoalPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 text-slate-900">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2 bg-slate-100 rounded-xl text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">New Savings Goal</h1>
      </header>

      {searchParams.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl text-center">
          {searchParams.error}
        </div>
      )}

      <form action={createGoal} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Goal Title</label>
          <div className="relative">
            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="title"
              type="text" 
              placeholder="e.g. New Laptop, Emergency Fund"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Target Amount (XAF)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="target_amount"
              type="number" 
              placeholder="0.00"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Target Date (Optional)</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="deadline"
              type="date" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100 mt-4">
          Create Goal
        </button>
      </form>
    </div>
  )
}