import React, { createContext, useContext, useState, ReactNode } from 'react'

type Role = 'manager' | 'employee'

interface AppContextProps {
  role: Role
  setRole: (role: Role) => void
  userName: string
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('manager')

  const userName = role === 'manager' ? 'Carlos Gerente' : 'Ana Silva'

  return <AppContext.Provider value={{ role, setRole, userName }}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
