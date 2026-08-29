/** profile 域接口封装（M1 完成后对接真实云函数） */
import { callFunction } from './request'

export interface ProfileSummary {
  ageBand: '4-6' | '6-8'
  levels: Record<string, number>
  reminder: { enabled: boolean; time: string }
  screenTimeLimitMin: number
  streakDays: number
  bestStreak: number
  onboardDone: boolean
  lockState: boolean
}

/** 静默建档，首次返回 isNew=true */
export function ensureProfile() {
  return callFunction<{ openid: string; isNew: boolean; ageBand: string }>('profile', 'ensure')
}

/** 首页聚合查询 */
export function getProfile() {
  return callFunction<ProfileSummary>('profile', 'get')
}

/** 更新龄段（次日生效） */
export function updateAgeBand(ageBand: '4-6' | '6-8') {
  return callFunction<{ effectiveDate: string }>('profile', 'updateAgeBand', { ageBand })
}

/** 更新提醒/防沉迷设置 */
export function updateSettings(settings: {
  reminder?: { enabled: boolean; time: string }
  screenTimeLimitMin?: number
}) {
  return callFunction<{ saved: boolean }>('profile', 'updateSettings', settings)
}
