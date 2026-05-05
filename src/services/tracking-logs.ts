import pb from '@/lib/pocketbase/client'

export interface TrackingLog {
  id: string
  employee: string
  latitude: number
  longitude: number
  created: string
  expand?: {
    employee?: {
      id: string
      name: string
    }
  }
}

export const getTrackingLogs = (filter?: string) =>
  pb
    .collection('tracking_logs')
    .getFullList<TrackingLog>({ sort: 'created', expand: 'employee', filter })

export const createTrackingLog = (data: {
  employee: string
  latitude: number
  longitude: number
}) => pb.collection('tracking_logs').create<TrackingLog>(data)
