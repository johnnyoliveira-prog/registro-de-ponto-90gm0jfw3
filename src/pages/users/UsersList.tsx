import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([])
  const { toast } = useToast()

  const loadUsers = () => {
    pb.collection('users').getFullList({ sort: '-created' }).then(setUsers)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return
    try {
      await pb.collection('users').delete(id)
      toast({ title: 'Usuário excluído com sucesso.' })
      loadUsers()
    } catch (err) {
      toast({ title: 'Erro ao excluir usuário.', variant: 'destructive' })
    }
  }

  const roleLabels: Record<string, string> = {
    employee: 'Funcionário',
    hr: 'RH',
    ceo: 'CEO',
    admin: 'Admin',
    coo: 'COO',
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-24 md:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema.</p>
        </div>
        <Button asChild>
          <Link to="/users/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Usuário
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{u.name || 'Sem nome'}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm border px-2 py-1 rounded bg-secondary/50 font-medium">
                    {roleLabels[u.role] || u.role}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/users/${u.id}/edit`}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum usuário encontrado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
