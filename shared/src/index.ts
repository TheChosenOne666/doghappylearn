/** 云函数统一错误码（方案文档 §6），前端 services/request 与云端共用 */
export const ErrorCode = {
  PARAM_INVALID: 1001,
  TASK_NOT_FOUND: 2001,
  TASK_ALREADY_DONE: 2002,
  EXCHANGE_FAILED: 3001,
  PRINT_PARAM_INVALID: 4001,
  PRINT_GENERATE_FAILED: 4002,
  FORBIDDEN: 9001,
  SYSTEM_ERROR: 9999
} as const

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode]

/** 云函数统一返回结构 */
export interface CloudResult<T = unknown> {
  code: number
  msg: string
  data: T
}

export function ok<T>(data: T): CloudResult<T> {
  return { code: 0, msg: '', data }
}

export function fail(code: ErrorCodeValue, msg: string): CloudResult<null> {
  return { code, msg, data: null }
}

/** 龄段枚举（users.age_band） */
export type AgeBand = '4-6' | '6-8'

/** 学科枚举（questions.subject） */
export type Subject = 'oral' | 'pinyin' | 'poem' | 'english'

/** 游戏类型（questions.type） */
export type GameType = 'oral_calc' | 'flashcard'
