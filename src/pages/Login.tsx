import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { getErrorMessage, extractFieldErrors } from '@/lib/pocketbase/errors'
import { Clock } from 'lucide-react'

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('employee')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFieldErrors({})

    if (!isValidEmail(email)) {
      setFieldErrors({ email: 'Por favor, insira um e-mail válido.' })
      setLoading(false)
      return
    }

    if (isLogin) {
      const { error } = await signIn(email, password)
      if (error) {
        setFieldErrors(extractFieldErrors(error))
        toast({
          title: 'Erro ao entrar',
          description: getErrorMessage(error),
          variant: 'destructive',
        })
      } else {
        navigate('/')
      }
    } else {
      const { error, isDuplicateEmail } = await signUp(email, password, name, role)
      if (error) {
        if (isDuplicateEmail) {
          if (email.toLowerCase() === 'johnnyoliveira@gmail.com') {
            toast({
              title: 'Conta de Administrador',
              description:
                'Este e-mail pertence ao administrador padrão. Por favor, faça login com a senha Skip@Pass.',
              action: (
                <ToastAction altText="Fazer Login" onClick={() => setIsLogin(true)}>
                  Login
                </ToastAction>
              ),
            })
          } else {
            toast({
              title: 'E-mail em uso',
              description:
                'This email is already registered in this system. Please log in instead.',
              action: (
                <ToastAction altText="Fazer Login" onClick={() => setIsLogin(true)}>
                  Login
                </ToastAction>
              ),
            })
          }
          setIsLogin(true)
        } else {
          setFieldErrors(extractFieldErrors(error))
          toast({
            title: 'Erro ao registrar',
            description: getErrorMessage(error),
            variant: 'destructive',
          })
        }
      } else {
        toast({
          title: 'Conta criada',
          description: 'Sua conta foi criada com sucesso.',
        })
        navigate('/')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-3 pb-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">GeoPonto Avançado</CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Entre na sua conta para continuar' : 'Crie sua conta de funcionário'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  required
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
              </div>
            )}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role">Nível de Acesso</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione o nível de acesso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Funcionário</SelectItem>
                    <SelectItem value="hr">RH</SelectItem>
                    <SelectItem value="ceo">CEO</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.role && <p className="text-sm text-red-500">{fieldErrors.role}</p>}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="nome@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {fieldErrors.password && (
                <p className="text-sm text-red-500">{fieldErrors.password}</p>
              )}
            </div>
            <Button className="w-full h-11 text-base mt-2" type="submit" disabled={loading}>
              {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setFieldErrors({})
              }}
              className="text-primary hover:underline font-medium"
              type="button"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
