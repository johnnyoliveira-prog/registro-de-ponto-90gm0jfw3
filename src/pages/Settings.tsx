import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getSettings,
  updateSettings,
  createSettings,
  Settings as ISettings,
} from '@/services/settings'
import { useToast } from '@/hooks/use-toast'
import { MapPin, Save, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export default function Settings() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [settings, setSettings] = useState<ISettings | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    lat: '',
    lng: '',
    radius: '',
  })

  // User role check
  const isEmployee = user?.role === 'employee'

  const load = useCallback(async () => {
    try {
      const data = await getSettings()
      if (data) {
        setSettings(data)
        setFormData({
          lat: data.base_latitude.toString(),
          lng: data.base_longitude.toString(),
          radius: data.radius_meters.toString(),
        })
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setInitialLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Real-time synchronization
  useRealtime('settings', () => {
    load()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isEmployee) {
      toast({
        title: 'Acesso Negado',
        description: 'Você não tem permissão para alterar as configurações.',
        variant: 'destructive',
      })
      return
    }

    const lat = parseFloat(formData.lat)
    const lng = parseFloat(formData.lng)
    const radius = parseFloat(formData.radius)

    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
      toast({
        title: 'Erro de Validação',
        description: 'Por favor, insira valores numéricos válidos em todos os campos.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const payload = {
        base_latitude: lat,
        base_longitude: lng,
        radius_meters: radius,
      }

      if (settings) {
        await updateSettings(settings.id, payload)
      } else {
        const created = await createSettings(payload)
        setSettings(created)
      }

      toast({
        title: 'Sucesso',
        description: 'Configurações de geofencing atualizadas com sucesso!',
      })
    } catch (err) {
      toast({
        title: 'Erro ao salvar configurações',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in-up">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const isFormDisabled = isEmployee || saving

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
        <p className="text-muted-foreground">Gerencie os parâmetros de Geofencing e sistema.</p>
      </div>

      {isEmployee && (
        <Alert className="bg-muted border-slate-200">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acesso Restrito</AlertTitle>
          <AlertDescription>
            Você tem permissão apenas de visualização para as configurações do sistema.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle>Geofencing (Cerca Virtual)</CardTitle>
          </div>
          <CardDescription>
            Defina a localização central da empresa e o raio de tolerância para alertas de ponto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude Base</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => setFormData((p) => ({ ...p, lat: e.target.value }))}
                  disabled={isFormDisabled}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude Base</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={(e) => setFormData((p) => ({ ...p, lng: e.target.value }))}
                  disabled={isFormDisabled}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="radius">Raio Permitido (em metros)</Label>
                <Input
                  id="radius"
                  type="number"
                  step="any"
                  min="0"
                  value={formData.radius}
                  onChange={(e) => setFormData((p) => ({ ...p, radius: e.target.value }))}
                  disabled={isFormDisabled}
                  required
                />
              </div>
            </div>

            {!isEmployee && (
              <Button type="submit" disabled={saving} className="w-full mt-4">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
