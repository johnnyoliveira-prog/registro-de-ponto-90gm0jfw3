import { Link, useLocation } from 'react-router-dom'
import { Map, Clock, Users, Settings, LayoutDashboard, History } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'

export function AppSidebar() {
  const location = useLocation()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  if (isMobile) return null

  const managerNav = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Monitoramento', url: '/monitoramento', icon: Map },
    { title: 'Registros', url: '/relatorios', icon: History },
    { title: 'Equipe', url: '#', icon: Users },
    { title: 'Configurações', url: '#', icon: Settings },
  ]

  const employeeNav = [
    { title: 'Início', url: '/', icon: LayoutDashboard },
    { title: 'Bater Ponto', url: '/registro', icon: Clock },
    { title: 'Meu Histórico', url: '/relatorios', icon: History },
  ]

  const navItems = user?.role === 'admin' ? managerNav : employeeNav

  return (
    <Sidebar className="border-r border-sidebar-border shadow-sm">
      <SidebarHeader className="h-16 flex items-center justify-center px-4">
        <div className="flex items-center gap-2 w-full">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">GeoPonto</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 p-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
