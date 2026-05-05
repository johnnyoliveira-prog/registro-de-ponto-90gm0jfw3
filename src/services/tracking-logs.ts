import pb from '@/lib/pocketbase/client'

export interface TrackingLog {
  id: string
  employee: string
  latitude: number
  longitude: number
  created: string
  expand?: {
    employee?: {
      name: string
      email: string
    }
  }
}

export const createTrackingLog = (data: Partial<TrackingLog>) =>
  pb.collection('tracking_logs').create<TrackingLog>(data)

export const getTrackingLogs = () =>
  pb.collection('tracking_logs').getFullList<TrackingLog>({ expand: 'employee', sort: '-created' })
