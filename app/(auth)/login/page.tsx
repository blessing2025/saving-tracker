import Link from 'next/link'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { login } from '@/app/actions'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col min-h-screen p-8 pt-20">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔐</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
        <p className="text-slate-500 mt-2">Sign in to continue saving</p>
      </div>
      
      {searchParams.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl text-center">
          {searchParams.error}
        </div>
      )}

      {searchParams.message && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium rounded-2xl text-center">
          {searchParams.message}
        </div>
      )}

      <form action={login} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1 tracking-wide">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              name="email"
              type="email" 
              placeholder="name@example.com"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-bold text-slate-700 tracking-wide">Password</label>
            <Link href="#" className="text-xs font-bold text-emerald-600">Forgot Password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="password"
              type="password" 
              placeholder="••••••••"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
            />
          </div>
        </div>

        <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4 group">
          Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="mt-auto pb-8 text-center">
        <p className="text-slate-500 text-sm">
          Don't have an account? {' '}
          <Link href="/register" className="text-emerald-600 font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )
}