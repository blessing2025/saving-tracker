import Link from 'next/link'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'
import { signup } from '@/app/actions'

export default async function RegisterPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col min-h-screen p-8 pt-12">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✨</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
        <p className="text-slate-500 mt-2">Start your savings journey today</p>
      </div>

      {searchParams.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl text-center whitespace-pre-wrap">
          {searchParams.error}
        </div>
      )}

      <form action={signup} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1 tracking-wide">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="full_name"
              type="text" 
              placeholder="Enter your name"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
            />
          </div>
        </div>

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
          <label className="text-sm font-bold text-slate-700 ml-1 tracking-wide">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="password"
              type="password" 
              placeholder="Create a password"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1 tracking-wide">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              name="confirm_password"
              type="password" 
              placeholder="Repeat password"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
            />
          </div>
        </div>

        <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4 group">
          Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="mt-8 pb-8 text-center">
        <p className="text-slate-500 text-sm font-medium">
          Already have an account? {' '}
          <Link href="/login" className="text-emerald-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
