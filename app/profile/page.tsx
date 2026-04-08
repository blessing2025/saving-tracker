import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, Mail, LogOut, ShieldCheck, Save } from 'lucide-react'
import { logout, updateProfile } from '@/app/actions'

export default async function ProfilePage(props: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const { message, error } = await props.searchParams;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex flex-col gap-8 p-6 pb-24 text-slate-900">
      <header className="text-center mt-4">
        <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl shadow-emerald-50">
          <span className="text-4xl">👤</span>
        </div>
        <h1 className="text-2xl font-black">{user.user_metadata?.full_name || 'User'}</h1>
        <p className="text-slate-400 text-sm font-medium">{user.email}</p>
      </header>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold rounded-2xl text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl text-center">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <form action={updateProfile} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                name="full_name"
                defaultValue={user.user_metadata?.full_name}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold transition-all"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div className="space-y-2 opacity-60">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                disabled
                value={user.email}
                className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold cursor-not-allowed"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Save size={18} /> Update Profile
          </button>
        </form>

        <div className="h-px bg-slate-100 my-4" />

        <form action={logout}>
          <button className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </form>
      </div>

      <div className="mt-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          <ShieldCheck size={12} /> Secure Account
        </div>
      </div>
    </div>
  )
}