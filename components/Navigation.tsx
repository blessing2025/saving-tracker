'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Target, History, BarChart3, User, MinusCircle } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  
  // Hide navigation on auth and landing pages
  const hideNav = ['/', '/login', '/register'].includes(pathname)
  if (hideNav) return null

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/goals/new', icon: Target, label: 'Goals' },
    { href: '/transactions', icon: History, label: 'History' },
    { href: '/reports', icon: BarChart3, label: 'Stats' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <div className="w-full max-w-md bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive ? 'bg-emerald-50' : ''
              }`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}