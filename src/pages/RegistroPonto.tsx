import { useState } from 'react'
import { MapPin, Camera, CheckCircle2, Navigation } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MockMap } from '@/components/ui-custom/MockMap'
import { cn } from '@/lib/utils'

type ShiftState = 'idle' | 'working' | 'break'

export default function RegistroPonto() {
  const [shiftState, setShiftState] = useState<ShiftState>('idle')
  const [isRegistering, setIsRegistering] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleRegister = () => {
    setIsRegistering(true)
    setTimeout(() => {
      setIsRegistering(false)
      setShowSuccess(true)

      // Update state
      if (shiftState === 'idle') setShiftState('working')
      else if (shiftState === 'working') setShiftState('break')
      else if (shiftState === 'break') setShiftState('working')

      setTimeout(() => setShowSuccess(false), 2000)
    }, 1500)
  }

  const getButtonConfig = () => {
    switch (shiftState) {
      case 'idle':
        return { text: 'Registrar Entrada', color: 'bg-emerald-500 hover:bg-emerald-600' }
      case 'working':
        return { text: 'Iniciar Pausa', color: 'bg-amber-500 hover:bg-amber-600' }
      case 'break':
        return { text: 'Retornar da Pausa', color: 'bg-emerald-500 hover:bg-emerald-600' }
    }
  }

  const config = getButtonConfig()

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 md:py-8 animate-fade-in">
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 animate-slide-up">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-800">Ponto Registrado!</h2>
            <p className="text-sm text-slate-500">Localização e foto confirmadas.</p>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col gap-4 relative">
        <Card className="flex-none overflow-hidden h-[300px] relative shadow-md">
          <MockMap
            markers={[
              {
                id: 'me',
                x: 50,
                y: 50,
                color: '#4F46E5',
                pulse: true,
                icon: <Navigation className="h-4 w-4 text-white" />,
              },
            ]}
          />
          <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow flex gap-3 items-center">
            <div className="bg-slate-100 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Av. Paulista, 1000</p>
              <p className="text-xs text-slate-500 truncate">Bela Vista, São Paulo - SP</p>
            </div>
          </div>
        </Card>

        <Card className="flex-none">
          <CardContent className="p-4 flex gap-4 items-center">
            <div className="h-16 w-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden">
              <Camera className="h-6 w-6 text-slate-400" />
              {/* Fake camera preview */}
              <img
                src="https://img.usecurling.com/ppl/thumbnail?seed=2"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt="Camera preview"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">Verificação Facial</p>
              <p className="text-xs text-slate-500">
                A câmera capturará uma foto no momento do registro.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-auto pt-6">
          <Button
            className={cn(
              'w-full h-16 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-95',
              config.color,
            )}
            onClick={handleRegister}
            disabled={isRegistering}
          >
            {isRegistering ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                Validando...
              </span>
            ) : (
              config.text
            )}
          </Button>

          {shiftState === 'working' && (
            <Button
              variant="outline"
              className="w-full mt-3 h-12 rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                setShiftState('idle')
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 2000)
              }}
            >
              Encerrar Expediente
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
