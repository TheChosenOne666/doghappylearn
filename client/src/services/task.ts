/** task 域接口封装（M1 完成后对接真实云函数） */
import { callFunction } from './request'

export interface DailyTask {
  taskId: string
  seq: number
  subject: 'oral' | 'pinyin' | 'poem' | 'english'
  gameType: 'oral_calc' | 'flashcard'
  status: 'pending' | 'doing' | 'done'
  result?: { correct: number; total: number; durationMs: number }
}

export interface EnsureTodayResult {
  date: string
  tasks: DailyTask[]
  questionPack: unknown
  screenTimeMin: number
  lockState: boolean
}

/** 获取/惰性生成今日任务与题包 */
export function ensureToday() {
  return callFunction<EnsureTodayResult>('task', 'ensureToday')
}

/** 提交单局成绩（roundId 幂等） */
export function submitRound(payload: {
  taskId: string
  roundId: string
  subject: string
  correct: number
  total: number
  durationMs: number
  wrongPoints: string[]
  screenTimeMin: number
}) {
  return callFunction<{
    gardenDelta: { growth: number; flowers: number }
    checkin: boolean
    milestone?: number
    newLevel?: number
  }>('task', 'submitRound', payload)
}
