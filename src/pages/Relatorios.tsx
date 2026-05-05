import { useState } from 'react'
import { FileDown, Map as MapIcon, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { MockMap } from '@/components/ui-custom/MockMap'

const LOGS = [
  {
    id: '1',
    name: 'Ana Silva',
    date: '05/05/2026',
    in: '08:00',
    out: '18:05',
    total: '09:05',
    deviation: 'Não',
    status: 'ok',
  },
  {
    id: '2',
    name: 'João Santos',
    date: '05/05/2026',
    in: '08:15',
    out: '18:00',
    total: '08:45',
    deviation: 'Sim',
    status: 'warning',
  },
  {
    id: '3',
    name: 'Marcos Oliveira',
    date: '04/05/2026',
    in: '08:00',
    out: '17:50',
    total: '08:50',
    deviation: 'Não',
    status: 'ok',
  },
  {
    id: '4',
    name: 'Carla Costa',
    date: '04/05/2026',
    in: '07:55',
    out: '18:10',
    total: '09:15',
    deviation: 'Não',
    status: 'ok',
  },
]

export default function Relatorios() {
  const [selectedLog, setSelectedLog] = useState<(typeof LOGS)[0] | null>(null)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Registros de Ponto</h2>
          <p className="text-muted-foreground">Histórico completo de presenças e rotas.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Colaborador</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Saída</TableHead>
                <TableHead>Total Hrs</TableHead>
                <TableHead>Desvio de Rota</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LOGS.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => setSelectedLog(log)}
                >
                  <TableCell className="font-medium">{log.name}</TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.in}</TableCell>
                  <TableCell>{log.out}</TableCell>
                  <TableCell>{log.total}</TableCell>
                  <TableCell>
                    {log.deviation === 'Sim' ? (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-700 hover:bg-red-100 border-none"
                      >
                        Sim
                      </Badge>
                    ) : (
                      <span className="text-slate-500">Não</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MapIcon className="h-4 w-4 text-primary" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto pt-10">
          <SheetHeader className="mb-6">
            <SheetTitle>Detalhes do Registro</SheetTitle>
            <SheetDescription>
              {selectedLog?.name} - {selectedLog?.date}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6">
            <div className="h-64 rounded-xl overflow-hidden border">
              <MockMap
                markers={[
                  { id: '1', x: 20, y: 30, color: '#4F46E5', label: 'Entrada' },
                  { id: '2', x: 80, y: 70, color: '#10B981', label: 'Saída' },
                ]}
                paths={[
                  {
                    id: '1',
                    points: [
                      { x: 20, y: 30 },
                      { x: 50, y: 20 },
                      { x: 80, y: 70 },
                    ],
                  },
                ]}
              />
            </div>

            <Card>
              <CardHeader className="py-3 px-4 bg-slate-50 border-b">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Linha do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative border-l-2 border-slate-200 ml-2 space-y-4">
                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-blue-500" />
                    <p className="text-sm font-medium">Entrada - {selectedLog?.in}</p>
                    <p className="text-xs text-slate-500">Rua Vergueiro, 1200 - SP</p>
                  </div>
                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-amber-500" />
                    <p className="text-sm font-medium">Pausa Almoço - 12:00</p>
                    <p className="text-xs text-slate-500">Av. Paulista, 1000 - SP</p>
                  </div>
                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                    <p className="text-sm font-medium">Saída - {selectedLog?.out}</p>
                    <p className="text-xs text-slate-500">R. Augusta, 500 - SP</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedLog?.deviation === 'Sim' && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-800">
                <strong className="block mb-1">Aviso de Desvio de Rota</strong>
                O trajeto percorrido não corresponde ao roteiro planejado entre 14:00 e 15:30.
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
