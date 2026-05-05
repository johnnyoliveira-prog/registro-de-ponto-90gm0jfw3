import { useAuth } from '@/hooks/use-auth'
import { Navigate } from 'react-router-dom'

export default function Index() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user?.role === 'ceo' || user?.role === 'hr') return <Navigate to="/dashboard" replace />
  return <Navigate to="/clock-in" replace />
}
