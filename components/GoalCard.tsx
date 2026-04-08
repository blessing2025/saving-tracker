// components/GoalCard.tsx
'use client'

import { Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface GoalProps {
  id: string
  title: string
  currentAmount: number
  targetAmount: number
  deadline: string | null
}

export default function GoalCard({ id, title, currentAmount, targetAmount, deadline }: GoalProps) {
  const safeCurrentAmount = currentAmount ?? 0
  // Added safety check to prevent division by zero if targetAmount is 0
  const progress = targetAmount > 0 ? Math.min((safeCurrentAmount / targetAmount) * 100, 100) : 0
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
        {deadline && (
          <div className="flex items-center text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(deadline).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Saved</span>
          <span className="font-medium text-emerald-600">${safeCurrentAmount.toLocaleString()}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-end text-xs text-slate-400">
          Target: ${targetAmount.toLocaleString()}
        </div>
      </div>

      <Link 
        href={`/deposit/${id}/`}
        className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
      >
        <DollarSign className="w-4 h-4" />
        Add Funds
      </Link>
    </div>
  )
}
