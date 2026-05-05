import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  getSettings,
  updateSettings,
  createSettings,
  Settings as ISettings,
} from '@/services/settings'
import { useToast } from '@/hooks/use-toast'
import { MapPin, Save } from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState<ISettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ lat: '', lng: '', radius: '' })
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
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
      } catch {
        /* ignore */
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        base_latitude: parseFloat(formData.lat),
        base_longitude: parseFloat(formData.lng),
        radius_meters: parseFloat(formData.radius),
      }

      if (settings) {
        await updateSettings(settings.id, payload)
      } else {
        const created = await createSettings(payload)
        setSettings(created)
      }

      toast({
        title: 'Sucesso',
        description: 'Configurações de geofencing salvas.',
      })
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
        <p className="text-muted-foreground">Gerencie os parâmetros de Geofencing e sistema.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle>Geofencing (Cerca Virtual)</CardTitle>
          </div>
          <CardDescription>
            Defina a localização central do escritório e o raio de tolerância para alertas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude Base</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => setFormData((p) => ({ ...p, lat: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude Base</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={(e) => setFormData((p) => ({ ...p, lng: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Raio Permitido (em metros)</Label>
                <Input
                  type="number"
                  value={formData.radius}
                  onChange={(e) => setFormData((p) => ({ ...p, radius: e.target.value }))}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-4">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
