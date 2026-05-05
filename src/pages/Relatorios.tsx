import { useState, useEffect } from 'react'
import { FileDown, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getTimeEntries, getMyTimeEntries, TimeEntry } from '@/services/time-entries'
import { getSettings, Settings } from '@/services/settings'
import { isOutsideGeofence } from '@/lib/geofence'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'

export default function Relatorios() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'ceo' || user?.role === 'hr'

  const loadData = async () => {
    try {
      const s = await getSettings()
      setSettings(s)

      const data = isAdmin ? await getTimeEntries() : await getMyTimeEntries()
      setEntries(data)
    } catch {
      /* intentionally ignored */
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [isAdmin])

  useRealtime('time_entries', () => loadData())

  const exportCSV = () => {
    if (entries.length === 0) return

    const headers = ['Data', 'Colaborador', 'Tipo', 'Latitude', 'Longitude', 'Endereço']
    const rows = entries.map((e) => [
      new Date(e.created).toLocaleString('pt-BR'),
      e.expand?.employee?.name || '-',
      e.type === 'clock_in' ? 'Entrada' : 'Saída',
      e.latitude,
      e.longitude,
      e.address || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `relatorio_pontos_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Registros de Ponto</h2>
          <p className="text-muted-foreground">Histórico completo de presenças e horários.</p>
        </div>
        <Button
          onClick={exportCSV}
          variant="outline"
          className="gap-2"
          disabled={entries.length === 0}
        >
          <FileDown className="h-4 w-4" />
          Exportar Relatório (CSV)
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Data / Hora</TableHead>
                {isAdmin && <TableHead>Colaborador</TableHead>}
                <TableHead>Tipo</TableHead>
                <TableHead>Localização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    Carregando registros...
                  </TableCell>
                </TableRow>
              )}
              {!loading && entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              )}
              {entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">
                    {new Date(entry.created).toLocaleString('pt-BR')}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>{entry.expand?.employee?.name || 'Desconhecido'}</TableCell>
                  )}
                  <TableCell>
                    {entry.type === 'clock_in' ? (
                      <span className="text-emerald-600 font-semibold">Entrada</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Saída</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>
                        {entry.latitude.toFixed(4)}, {entry.longitude.toFixed(4)}
                      </span>
                      {isOutsideGeofence(
                        entry.latitude,
                        entry.longitude,
                        settings?.base_latitude,
                        settings?.base_longitude,
                        settings?.radius_meters,
                      ) && (
                        <Badge variant="destructive" className="text-[10px] gap-1 px-1.5 py-0">
                          <AlertTriangle className="h-3 w-3" />
                          Fora do Perímetro
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
