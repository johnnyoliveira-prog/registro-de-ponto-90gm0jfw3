import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    pb.collection('users').getFullList({ sort: '-created' }).then(setUsers)
  }, [])

  const roleLabels: Record<string, string> = {
    employee: 'Funcionário',
    hr: 'RH',
    ceo: 'CEO',
    admin: 'Admin',
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
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{u.name || 'Sem nome'}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
                <div className="text-sm border px-2 py-1 rounded bg-secondary/50 font-medium">
                  {roleLabels[u.role] || u.role}
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
