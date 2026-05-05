import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { getSettings, updateSettings, createSettings, Settings } from '@/services/settings'

export default function Configuracoes() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    base_latitude: '',
    base_longitude: '',
    radius_meters: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings()
        if (data.length > 0) {
          setSettings(data[0])
          setFormData({
            base_latitude: data[0].base_latitude.toString(),
            base_longitude: data[0].base_longitude.toString(),
            radius_meters: data[0].radius_meters.toString(),
          })
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        base_latitude: parseFloat(formData.base_latitude),
        base_longitude: parseFloat(formData.base_longitude),
        radius_meters: parseFloat(formData.radius_meters),
      }

      if (settings?.id) {
        await updateSettings(settings.id, payload)
      } else {
        const res = await createSettings(payload)
        setSettings(res as Settings)
      }

      toast({
        title: 'Sucesso',
        description: 'Configurações de geofencing atualizadas.',
      })
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando...</div>

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie os parâmetros do sistema e perímetro seguro.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geofencing</CardTitle>
          <CardDescription>Defina as coordenadas da sede e o raio permitido.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base_latitude">Latitude Base</Label>
                <Input
                  id="base_latitude"
                  type="number"
                  step="any"
                  required
                  value={formData.base_latitude}
                  onChange={(e) => setFormData({ ...formData, base_latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_longitude">Longitude Base</Label>
                <Input
                  id="base_longitude"
                  type="number"
                  step="any"
                  required
                  value={formData.base_longitude}
                  onChange={(e) => setFormData({ ...formData, base_longitude: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="radius_meters">Raio Permitido (metros)</Label>
              <Input
                id="radius_meters"
                type="number"
                required
                value={formData.radius_meters}
                onChange={(e) => setFormData({ ...formData, radius_meters: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
