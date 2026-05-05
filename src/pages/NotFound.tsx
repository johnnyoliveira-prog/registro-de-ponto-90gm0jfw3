import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MapPinOff } from 'lucide-react'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('Erro 404: Usuário tentou acessar rota inexistente:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center animate-fade-in">
      <div className="bg-slate-100 p-6 rounded-full mb-6">
        <MapPinOff className="h-16 w-16 text-slate-400" />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-lg text-slate-600 mb-8 max-w-md">
        Ops! Parece que você se perdeu na rota. A página que você está procurando não existe.
      </p>
      <Button asChild size="lg">
        <Link to="/">Voltar ao Início</Link>
      </Button>
    </div>
  )
}

export default NotFound
