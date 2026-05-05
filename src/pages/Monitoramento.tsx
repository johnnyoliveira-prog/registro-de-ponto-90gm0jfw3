import { useState } from 'react'
import { Search, MapPin, Coffee, LogIn } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MockMap, MapMarker, MapPath } from '@/components/ui-custom/MockMap'
import { Badge } from '@/components/ui/badge'

const EMPLOYEES = [
  { id: '1', name: 'Ana Silva', role: 'Técnica de Campo', status: 'active', seed: 2 },
  { id: '2', name: 'João Santos', role: 'Vendedor Externo', status: 'break', seed: 4 },
  { id: '3', name: 'Marcos Oliveira', role: 'Manutenção', status: 'offline', seed: 7 },
  { id: '4', name: 'Carla Costa', role: 'Vendedora', status: 'active', seed: 9 },
]

export default function Monitoramento() {
  const [search, setSearch] = useState('')
  const [selectedEmp, setSelectedEmp] = useState<string | null>('1')

  const filtered = EMPLOYEES.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))

  // Mock markers and paths based on selection
  const mapData = {
    markers: selectedEmp
      ? ([
          {
            id: 'start',
            x: 20,
            y: 30,
            color: '#3B82F6',
            icon: <LogIn className="h-4 w-4 text-white" />,
            label: '08:00 - Entrada',
          },
          {
            id: 'break',
            x: 50,
            y: 60,
            color: '#F59E0B',
            icon: <Coffee className="h-4 w-4 text-white" />,
            label: '12:00 - Pausa',
          },
          {
            id: 'current',
            x: 70,
            y: 40,
            color: '#10B981',
            pulse: true,
            icon: <MapPin className="h-4 w-4 text-white" />,
            label: 'Atual',
          },
        ] as MapMarker[])
      : [],
    paths: selectedEmp
      ? ([
          {
            id: 'p1',
            points: [
              { x: 20, y: 30 },
              { x: 40, y: 35 },
              { x: 50, y: 60 },
            ],
            color: '#94A3B8',
          },
          {
            id: 'p2',
            points: [
              { x: 50, y: 60 },
              { x: 65, y: 55 },
              { x: 70, y: 40 },
            ],
            color: '#4F46E5',
          },
        ] as MapPath[])
      : [],
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Sidebar List */}
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
            {filtered.map((emp) => (
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
                      src={`https://img.usecurling.com/ppl/thumbnail?seed=${emp.seed}`}
                    />
                    <AvatarFallback>{emp.name[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      emp.status === 'active'
                        ? 'bg-emerald-500'
                        : emp.status === 'break'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{emp.name}</p>
                  <p className="text-xs text-slate-500 truncate">{emp.role}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative h-[60vh] md:h-auto">
        {selectedEmp ? (
          <>
            <MockMap
              markers={mapData.markers}
              paths={mapData.paths}
              className="rounded-none border-0"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 border border-border max-w-xs animate-fade-in-down">
              <h3 className="font-semibold text-sm mb-1">Rota de Hoje</h3>
              <p className="text-xs text-slate-500 mb-3">Distância percorrida: ~12km</p>
              <div className="flex gap-2 text-xs">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Entrada: 08:00
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  Em Rota
                </Badge>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
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
