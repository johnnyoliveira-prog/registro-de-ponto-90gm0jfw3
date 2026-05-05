import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Clock, History, Map } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const location = useLocation()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  if (!isMobile) return null

  const managerNav = [
    { title: 'Mapa', url: '/dashboard', icon: Map },
    { title: 'Histórico', url: '/relatorios', icon: History },
  ]

  const employeeNav = [
    { title: 'Ponto', url: '/clock-in', icon: Clock },
    { title: 'Histórico', url: '/relatorios', icon: History },
  ]

  const isAdmin = user?.role === 'ceo' || user?.role === 'hr'
  const navItems = isAdmin ? managerNav : employeeNav

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-border flex items-center justify-around px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.url
        return (
          <Link
            key={item.title}
            to={item.url}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
              isActive ? 'text-primary' : 'text-slate-500',
            )}
          >
            <div className={cn('p-1.5 rounded-full transition-all', isActive && 'bg-primary/10')}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium">{item.title}</span>
          </Link>
        )
      })}
    </div>
  )
}
