import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MockMap, MapMarker } from '@/components/ui-custom/MockMap'
import { getTrackingLogs, TrackingLog } from '@/services/tracking-logs'
import { getSettings, Settings } from '@/services/settings'
import { useRealtime } from '@/hooks/use-realtime'
import { isOutsideGeofence } from '@/lib/geofence'
import { Navigation, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function Dashboard() {
  const [logs, setLogs] = useState<Record<string, TrackingLog>>({})
  const [settings, setSettings] = useState<Settings | null>(null)

  const loadData = async () => {
    try {
      const s = await getSettings()
      setSettings(s)

      const allLogs = await getTrackingLogs()
      const latestLogs: Record<string, TrackingLog> = {}
      for (const log of allLogs) {
        if (!latestLogs[log.employee]) {
          latestLogs[log.employee] = log
        }
      }
      setLogs(latestLogs)
    } catch {
      // Ignored
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('tracking_logs', () => {
    loadData()
  })

  const markers: MapMarker[] = Object.values(logs).map((log, i) => {
    const isOut = isOutsideGeofence(
      log.latitude,
      log.longitude,
      settings?.base_latitude,
      settings?.base_longitude,
      settings?.radius_meters,
    )
    const diffLat = settings ? (log.latitude - settings.base_latitude) * 1000 : i * 5
    const diffLon = settings ? (log.longitude - settings.base_longitude) * 1000 : i * 5

    return {
      id: log.id,
      x: Math.max(10, Math.min(90, 50 + diffLon)),
      y: Math.max(10, Math.min(90, 50 - diffLat)),
      color: isOut ? '#ef4444' : '#3b82f6',
      icon: <Navigation className="h-4 w-4 text-white" />,
      label: log.expand?.employee?.name || 'User',
      pulse: isOut,
    }
  })

  if (settings) {
    markers.push({
      id: 'base',
      x: 50,
      y: 50,
      color: '#22c55e',
      icon: <div className="h-2 w-2 bg-white rounded-full" />,
      label: 'Sede (Centro)',
      pulse: true,
    })
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 h-full animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard de Gestão</h2>
          <p className="text-muted-foreground">Monitoramento em tempo real da equipe em campo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          <div className="flex-1 relative min-h-[400px]">
            <MockMap markers={markers} mapStyle="silver" />
          </div>
        </Card>

        <Card className="flex flex-col h-full max-h-[600px]">
          <CardHeader>
            <CardTitle>Equipe em Campo</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {Object.values(logs).length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">Nenhum registro ativo.</p>
              )}
              {Object.values(logs).map((log) => {
                const isOut = isOutsideGeofence(
                  log.latitude,
                  log.longitude,
                  settings?.base_latitude,
                  settings?.base_longitude,
                  settings?.radius_meters,
                )
                return (
                  <div
                    key={log.id}
                    className="flex flex-col p-3 rounded-lg border bg-slate-50 gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm">
                        {log.expand?.employee?.name || 'Desconhecido'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(log.created).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                    {isOut ? (
                      <Badge variant="destructive" className="w-fit gap-1 text-[10px]">
                        <AlertTriangle className="h-3 w-3" />
                        Fora do Perímetro
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="w-fit text-[10px] bg-emerald-100 text-emerald-800 border-transparent"
                      >
                        No Perímetro
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
