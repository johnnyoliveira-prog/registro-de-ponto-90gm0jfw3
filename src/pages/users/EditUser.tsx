import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import pb from '@/lib/pocketbase/client'
import { getErrorMessage, extractFieldErrors } from '@/lib/pocketbase/errors'

export default function EditUser() {
  const { id } = useParams<{ id: string }>()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('employee')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (!id) return
    pb.collection('users')
      .getOne(id)
      .then((record) => {
        setName(record.name || '')
        setEmail(record.email || '')
        setRole(record.role || 'employee')
        setLoadingData(false)
      })
      .catch(() => {
        toast({ title: 'Erro ao carregar usuário', variant: 'destructive' })
        navigate('/users')
      })
  }, [id, navigate, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setLoading(true)
    setFieldErrors({})

    try {
      const data: any = { name, email, role }
      if (password) {
        data.password = password
        data.passwordConfirm = password
      }

      await pb.collection('users').update(id, data)

      toast({
        title: 'Usuário atualizado',
        description: 'Os dados do usuário foram atualizados com sucesso.',
      })
      navigate('/users')
    } catch (error: any) {
      setFieldErrors(extractFieldErrors(error))
      toast({
        title: 'Erro ao atualizar usuário',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto space-y-6 pb-24 md:pb-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar Usuário</CardTitle>
          <CardDescription>
            Altere os dados do membro da equipe. Deixe a senha em branco para não alterar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha (opcional)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deixe em branco para manter a atual"
              />
              {fieldErrors.password && (
                <p className="text-sm text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Nível de Acesso</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Funcionário</SelectItem>
                  <SelectItem value="hr">RH</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="ceo">CEO</SelectItem>
                  <SelectItem value="coo">COO</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.role && <p className="text-sm text-red-500">{fieldErrors.role}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
