/**
 * 埋点工具（架构文档 §3.3）
 * 本地缓存批量上报：满 10 条或 30s 定时触发；不采集任何身份字段。
 */
import Taro from '@tarojs/taro'
import { reportEvents, TrackEvent } from '../services/track'

const STORAGE_KEY = 'track_events_buffer'
const FLUSH_SIZE = 10
const FLUSH_INTERVAL_MS = 30000

let timerStarted = false

function readBuffer(): TrackEvent[] {
  return Taro.getStorageSync(STORAGE_KEY) || []
}

function writeBuffer(events: TrackEvent[]) {
  Taro.setStorageSync(STORAGE_KEY, events)
}

async function flush() {
  const buffer = readBuffer()
  if (buffer.length === 0) return
  writeBuffer([])
  try {
    await reportEvents(buffer)
  } catch (err) {
    console.warn('[tracker] 上报失败，事件放回缓冲', err)
    writeBuffer([...readBuffer(), ...buffer].slice(0, 100))
  }
}

function startTimer() {
  if (timerStarted) return
  timerStarted = true
  setInterval(flush, FLUSH_INTERVAL_MS)
}

/**
 * 上报埋点事件（E1–E10）
 * @param event 事件名，如 'E1_APP_FIRST_OPEN'
 * @param params 事件参数，不含 openid 等身份字段
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  const buffer = readBuffer()
  buffer.push({ event, params, clientTs: Date.now() })
  writeBuffer(buffer)
  startTimer()
  if (buffer.length >= FLUSH_SIZE) {
    void flush()
  }
}
