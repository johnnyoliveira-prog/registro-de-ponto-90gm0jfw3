import pb from '@/lib/pocketbase/client'

export interface TimeEntry {
  id: string
  employee: string
  type: 'clock_in' | 'clock_out'
  latitude: number
  longitude: number
  address?: string
  created: string
  updated: string
  expand?: {
    employee?: {
      id: string
      name: string
      email: string
    }
  }
}

export const getTimeEntries = () =>
  pb.collection('time_entries').getFullList<TimeEntry>({ sort: '-created', expand: 'employee' })

export const getMyTimeEntries = () =>
  pb.collection('time_entries').getFullList<TimeEntry>({ sort: '-created' })

export const createTimeEntry = (data: {
  employee: string
  type: 'clock_in' | 'clock_out'
  latitude: number
  longitude: number
  address?: string
}) => pb.collection('time_entries').create<TimeEntry>(data)
