import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import Layout from './components/Layout'
import { Navigate } from 'react-router-dom'

import Index from './pages/Index'
import Login from './pages/Login'
import RegistroPonto from './pages/RegistroPonto'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Relatorios from './pages/Relatorios'
import NotFound from './pages/NotFound'
import UsersList from './pages/users/UsersList'
import NewUser from './pages/users/NewUser'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const ManagerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  if (user?.role === 'employee') return <Navigate to="/" replace />
  return <>{children}</>
}

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Index />} />
            <Route path="/clock-in" element={<RegistroPonto />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route
              path="/users"
              element={
                <ManagerRoute>
                  <UsersList />
                </ManagerRoute>
              }
            />
            <Route
              path="/users/new"
              element={
                <ManagerRoute>
                  <NewUser />
                </ManagerRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
