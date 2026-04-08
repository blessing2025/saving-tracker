import Link from 'next/link'
import { ArrowRight, Target, Shield, PiggyBank } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-8">
        <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-emerald-50">
          <PiggyBank size={48} className="text-emerald-600" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Save Smarter,<br/>
            <span className="text-emerald-600">Live Better.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-xs mx-auto">
            Track your goals, monitor progress, and reach your financial dreams faster.
          </p>
        </div>

        <div className="flex flex-col w-full gap-4 max-w-xs">
          {user ? (
            <Link href="/dashboard" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link href="/register" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                Join Now <ArrowRight size={20} />
              </Link>
              <Link href="/login" className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                Sign In
              </Link>
            </>
          )}
        </div>
      </main>

      <footer className="p-8 grid grid-cols-2 gap-4 border-t border-slate-50">
        <div className="flex items-center gap-2 text-slate-400">
          <Target size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Goal Oriented</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Shield size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Secure & Private</span>
        </div>
      </footer>
    </div>
  )
}