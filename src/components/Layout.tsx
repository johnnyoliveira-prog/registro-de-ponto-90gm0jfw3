import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './layout/AppSidebar'
import { AppHeader } from './layout/AppHeader'
import { MobileBottomNav } from './layout/MobileBottomNav'
import { useMemo } from 'react'

export default function Layout() {
  const location = useLocation()

  const pageTitle = useMemo(() => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/registro':
        return 'Registro de Ponto'
      case '/monitoramento':
        return 'Monitoramento'
      case '/relatorios':
        return 'Relatórios'
      default:
        return 'GeoPonto'
    }
  }, [location.pathname])

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader title={pageTitle} />
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative animate-fade-in bg-slate-50/50">
            <Outlet />
          </main>
          <MobileBottomNav />
        </div>
      </div>
    </SidebarProvider>
  )
}
