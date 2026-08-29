/** track 埋点上报接口封装（E1–E10，PRD 9.2） */
import { callFunction } from './request'

export interface TrackEvent {
  event: string
  params: Record<string, unknown>
  clientTs: number
}

export function reportEvents(events: TrackEvent[]) {
  return callFunction<{ accepted: number }>('track', 'report', { events: events.slice(0, 50) })
}
