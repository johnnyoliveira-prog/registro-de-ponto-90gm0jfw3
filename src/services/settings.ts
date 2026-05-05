import pb from '@/lib/pocketbase/client'

export interface Settings {
  id: string
  base_latitude: number
  base_longitude: number
  radius_meters: number
}

export const getSettings = async (): Promise<Settings | null> => {
  const records = await pb.collection('settings').getFullList<Settings>(1)
  return records.length > 0 ? records[0] : null
}

export const updateSettings = async (id: string, data: Partial<Settings>) => {
  return pb.collection('settings').update<Settings>(id, data)
}

export const createSettings = async (data: Omit<Settings, 'id'>) => {
  return pb.collection('settings').create<Settings>(data)
}
