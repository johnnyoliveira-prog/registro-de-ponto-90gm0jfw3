import { useState, useEffect, useRef } from 'react'
import { MapPin, Camera, CheckCircle2, Navigation } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MockMap } from '@/components/ui-custom/MockMap'
import { useAuth } from '@/hooks/use-auth'
import { createTimeEntry, getMyTimeEntries } from '@/services/time-entries'
import { createTrackingLog } from '@/services/tracking-logs'
import { useToast } from '@/hooks/use-toast'

export default function RegistroPonto() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [shiftState, setShiftState] = useState<'idle' | 'working'>('idle')
  const [isRegistering, setIsRegistering] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null)

  const trackingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkState = async () => {
      try {
        const entries = await getMyTimeEntries()
        const today = new Date().toISOString().split('T')[0]
        const todayEntries = entries
          .filter((e) => e.created.startsWith(today))
          .sort((a, b) => a.created.localeCompare(b.created))
        const last = todayEntries[todayEntries.length - 1]
        if (last && last.type === 'clock_in') {
          setShiftState('working')
          startTracking()
        }
      } catch {
        /* intentionally ignored */
      }
    }
    checkState()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () =>
          toast({
            title: 'Aviso',
            description: 'Ative a localização para maior precisão.',
            variant: 'destructive',
          }),
      )
    }

    return () => stopTracking()
  }, [])

  const startTracking = () => {
    if (trackingRef.current) clearInterval(trackingRef.current)
    trackingRef.current = setInterval(() => {
      if (navigator.geolocation && user?.id) {
        navigator.geolocation.getCurrentPosition((p) => {
          createTrackingLog({
            employee: user.id,
            latitude: p.coords.latitude,
            longitude: p.coords.longitude,
          }).catch(() => {})
        })
      }
    }, 30000) // mock background sync every 30s
  }

  const stopTracking = () => {
    if (trackingRef.current) clearInterval(trackingRef.current)
  }

  const handleRegister = async (type: 'clock_in' | 'clock_out') => {
    if (!navigator.geolocation) {
      toast({
        title: 'Erro',
        description: 'Geolocalização não suportada pelo seu navegador',
        variant: 'destructive',
      })
      return
    }

    setIsRegistering(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
      })

      const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
      setPos(coords)

      await createTimeEntry({
        employee: user.id,
        type,
        latitude: coords.lat,
        longitude: coords.lng,
        address: 'Localização GPS',
      })

      if (type === 'clock_in') {
        setShiftState('working')
        startTracking()
        await createTrackingLog({
          employee: user.id,
          latitude: coords.lat,
          longitude: coords.lng,
        }).catch(() => {})
      } else {
        setShiftState('idle')
        stopTracking()
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar o ponto. Verifique a permissão do GPS.',
        variant: 'destructive',
      })
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 md:py-8 animate-fade-in">
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 animate-slide-up">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-800">Ponto Registrado!</h2>
            <p className="text-sm text-slate-500">Localização confirmada com sucesso.</p>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col gap-4 relative">
        <Card className="flex-none overflow-hidden h-[300px] relative shadow-md">
          <MockMap
            markers={
              pos
                ? [
                    {
                      id: 'me',
                      x: 50,
                      y: 50,
                      color: '#4F46E5',
                      pulse: true,
                      icon: <Navigation className="h-4 w-4 text-white" />,
                    },
                  ]
                : []
            }
          />
          <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow flex gap-3 items-center">
            <div className="bg-slate-100 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">GPS Ativo</p>
              <p className="text-xs text-slate-500 truncate">
                {pos
                  ? `Lat: ${pos.lat.toFixed(4)}, Lng: ${pos.lng.toFixed(4)}`
                  : 'Aguardando sinal...'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="flex-none">
          <CardContent className="p-4 flex gap-4 items-center">
            <div className="h-16 w-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden">
              <Camera className="h-6 w-6 text-slate-400" />
              <img
                src={`https://img.usecurling.com/ppl/thumbnail?seed=${user?.id || 1}`}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt="Camera preview"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">Verificação Facial</p>
              <p className="text-xs text-slate-500">
                Uma foto será anexada automaticamente ao seu registro de ponto.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          {shiftState === 'idle' ? (
            <Button
              className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-95 bg-emerald-500 hover:bg-emerald-600"
              onClick={() => handleRegister('clock_in')}
              disabled={isRegistering}
            >
              {isRegistering ? 'Validando...' : 'Registrar Entrada'}
            </Button>
          ) : (
            <Button
              className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-95 bg-red-500 hover:bg-red-600"
              onClick={() => handleRegister('clock_out')}
              disabled={isRegistering}
            >
              {isRegistering ? 'Validando...' : 'Encerrar Expediente'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
