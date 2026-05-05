import { useEffect, useState } from 'react'
import { Users, Clock, AlertTriangle, TrendingUp, MapPin, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { MockMap, MapMarker } from '@/components/ui-custom/MockMap'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { getTrackingLogs } from '@/services/tracking-logs'
import { getMyTimeEntries } from '@/services/time-entries'

const chartData = [
  { day: 'Seg', hours: 8.5 },
  { day: 'Ter', hours: 9.1 },
  { day: 'Qua', hours: 7.8 },
  { day: 'Qui', hours: 8.2 },
  { day: 'Sex', hours: 8.0 },
]

export default function Index() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [todayEntries, setTodayEntries] = useState<any[]>([])

  useEffect(() => {
    if (user?.role === 'admin') {
      const today = new Date().toISOString().split('T')[0]
      getTrackingLogs(`created >= "${today} 00:00:00"`)
        .then((logs) => {
          const userLatest = new Map()
          logs.forEach((log) => userLatest.set(log.employee, log))
          const m: MapMarker[] = Array.from(userLatest.values()).map((log, i) => ({
            id: log.id,
            x: 50 + (i * 10 - 20), // mock percentage layout since we don't have a real map renderer built into index
            y: 50 + (i % 2 === 0 ? 10 : -10),
            color: '#10B981',
            pulse: true,
            icon: <MapPin className="h-4 w-4 text-white" />,
          }))
          setMarkers(m.slice(0, 5)) // max 5 for preview
        })
        .catch(() => {})
    } else if (user?.role === 'employee') {
      const today = new Date().toISOString().split('T')[0]
      getMyTimeEntries()
        .then((entries) => {
          setTodayEntries(
            entries
              .filter((e) => e.created.startsWith(today))
              .sort((a, b) => a.created.localeCompare(b.created)),
          )
        })
        .catch(() => {})
    }
  }, [user])

  if (user?.role === 'employee') {
    const lastEntry = todayEntries[todayEntries.length - 1]
    const isWorking = lastEntry?.type === 'clock_in'

    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto w-full flex flex-col gap-6 animate-fade-in-up">
        <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50 shadow-sm">
          <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isWorking ? 'Em Expediente' : 'Fora do Expediente'}
            </h2>
            {lastEntry && (
              <p className="text-sm text-slate-500">
                Último registro:{' '}
                {new Date(lastEntry.created).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                ({lastEntry.type === 'clock_in' ? 'Entrada' : 'Saída'})
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="w-full h-20 rounded-2xl text-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            onClick={() => navigate('/registro')}
          >
            Registrar Ponto
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Linha do Tempo (Hoje)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-2">
              {todayEntries.length === 0 && (
                <p className="text-sm text-slate-500 pl-4">Nenhum registro hoje.</p>
              )}
              {todayEntries.map((entry) => (
                <div key={entry.id} className="relative pl-6">
                  <span
                    className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white ${entry.type === 'clock_in' ? 'bg-emerald-500' : 'bg-red-500'}`}
                  />
                  <p className="text-sm font-medium">
                    {entry.type === 'clock_in' ? 'Entrada' : 'Saída'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(entry.created).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    - {entry.address || 'Localização capturada'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Manager View
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total de Funcionários</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">12</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Em Campo Agora</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{markers.length}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Activity className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Atrasos</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">1</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Produtividade Média</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">94%</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col h-[400px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              Monitoramento Rápido
              <Button variant="ghost" size="sm" onClick={() => navigate('/monitoramento')}>
                Ver Completo
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0">
            <MockMap markers={markers} />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[400px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Média de Horas (Equipe)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <ChartContainer
              config={{ hours: { color: 'hsl(var(--primary))' } }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="hours" fill="var(--color-hours)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
