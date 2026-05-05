import { useState, useEffect, useMemo } from 'react'
import { Search, MapPin, LogIn } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MockMap, MapMarker } from '@/components/ui-custom/MockMap'
import { Badge } from '@/components/ui/badge'
import { getTrackingLogs, TrackingLog } from '@/services/tracking-logs'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

export default function Monitoramento() {
  const [search, setSearch] = useState('')
  const [selectedEmp, setSelectedEmp] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [logs, setLogs] = useState<TrackingLog[]>([])

  const loadData = async () => {
    try {
      const u = await pb.collection('users').getFullList({ filter: "role = 'employee'" })
      setUsers(u)

      const today = new Date().toISOString().split('T')[0]
      const l = await getTrackingLogs(`created >= "${today} 00:00:00"`)
      setLogs(l)
    } catch {
      /* intentionally ignored */
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('tracking_logs', () => {
    loadData()
  })

  const filteredUsers = users.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))

  const mapData = useMemo(() => {
    if (!selectedEmp) return { markers: [], paths: [] }
    const empLogs = logs
      .filter((l) => l.employee === selectedEmp)
      .sort((a, b) => a.created.localeCompare(b.created))
    if (empLogs.length === 0) return { markers: [], paths: [] }

    const lats = empLogs.map((l) => l.latitude)
    const lngs = empLogs.map((l) => l.longitude)
    const minLat = Math.min(...lats),
      maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs),
      maxLng = Math.max(...lngs)

    const toXY = (lat: number, lng: number) => {
      if (minLat === maxLat || minLng === maxLng) return { x: 50, y: 50 }
      const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10
      const y = ((lat - minLat) / (maxLat - minLat)) * 80 + 10
      return { x, y: 100 - y }
    }

    const points = empLogs.map((l) => toXY(l.latitude, l.longitude))
    const first = empLogs[0]
    const last = empLogs[empLogs.length - 1]

    const markers: MapMarker[] = [
      {
        id: 'start',
        ...toXY(first.latitude, first.longitude),
        color: '#3B82F6',
        icon: <LogIn className="h-4 w-4 text-white" />,
        label: 'Início',
      },
    ]
    if (empLogs.length > 1) {
      markers.push({
        id: 'current',
        ...toXY(last.latitude, last.longitude),
        color: '#10B981',
        pulse: true,
        icon: <MapPin className="h-4 w-4 text-white" />,
        label: 'Atual',
      })
    }

    return {
      markers,
      paths: [{ id: 'p1', points, color: '#4F46E5' }],
    }
  }, [selectedEmp, logs])

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-80 bg-white border-r border-border flex flex-col z-10 shrink-0 shadow-[2px_0_8px_rgba(0,0,0,0.05)] md:h-full">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg mb-4">Equipe em Campo</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar funcionário..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 flex flex-col gap-1">
            {filteredUsers.map((emp) => {
              const empLogs = logs.filter((l) => l.employee === emp.id)
              const isActive = empLogs.length > 0
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmp(emp.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    selectedEmp === emp.id
                      ? 'bg-primary/10 border-primary/20'
                      : 'hover:bg-slate-50 border-transparent'
                  } border`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        src={`https://img.usecurling.com/ppl/thumbnail?seed=${emp.id}`}
                      />
                      <AvatarFallback>{emp.name[0]}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isActive ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">{emp.name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {isActive ? 'Em campo' : 'Offline'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 relative h-[60vh] md:h-auto bg-slate-100">
        {selectedEmp ? (
          <>
            <MockMap
              markers={mapData.markers}
              paths={mapData.paths}
              className="rounded-none border-0"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 border border-border max-w-xs animate-fade-in-down">
              <h3 className="font-semibold text-sm mb-1">Rota de Hoje</h3>
              <div className="flex gap-2 text-xs mt-2">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  Ao vivo
                </Badge>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <div className="text-center flex flex-col items-center">
              <MapPin className="h-12 w-12 mb-2 opacity-50" />
              <p>Selecione um funcionário para ver o trajeto</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
