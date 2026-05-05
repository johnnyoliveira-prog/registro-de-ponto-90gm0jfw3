import { useEffect, useState } from 'react'
import { Bell, User } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AppHeader({ title }: { title: string }) {
  const { user, signOut } = useAuth()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-border shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium text-slate-500">
            {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </span>
          <span className="text-lg font-bold text-slate-800">
            {time.toLocaleTimeString('pt-BR')}
          </span>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-emerald-500">
                <AvatarImage
                  src={`https://img.usecurling.com/ppl/thumbnail?seed=${user?.role === 'admin' ? 5 : 2}`}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.name}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user?.role === 'admin' ? 'Administrador' : 'Agente de Campo'}
                </p>
              </div>
            </div>
            <div className="px-2 py-1">
              <hr />
            </div>
            <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
