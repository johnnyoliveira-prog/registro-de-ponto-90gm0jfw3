import pb from '@/lib/pocketbase/client'

export interface TimeEntry {
  id: string
  employee: string
  type: 'clock_in' | 'clock_out'
  latitude: number
  longitude: number
  address?: string
  created: string
  expand?: {
    employee?: {
      name: string
      email: string
    }
  }
}

export const getTimeEntries = () =>
  pb.collection('time_entries').getFullList<TimeEntry>({ expand: 'employee', sort: '-created' })

export const getMyTimeEntries = () =>
  pb.collection('time_entries').getFullList<TimeEntry>({ sort: '-created' })

export const createTimeEntry = (data: Partial<TimeEntry>) =>
  pb.collection('time_entries').create<TimeEntry>(data)
