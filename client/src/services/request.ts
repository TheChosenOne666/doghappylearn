/**
 * 云函数请求层统一封装（架构文档 §3.3）
 * - 统一超时 8s、网络异常重试 1 次
 * - 统一错误码结构与日志
 * - 后续接入离线队列（offline-queue）
 */
import Taro from '@tarojs/taro'

/** 云函数统一返回结构 */
export interface CloudResult<T> {
  code: number
  msg: string
  data: T
}

/** 业务错误码（与 shared/types/errors 对齐，方案文档 §6） */
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

const REQUEST_TIMEOUT = 8000
const MAX_RETRY = 1

/** 日志脱敏：openid 只保留前 6 位 */
export function maskOpenid(openid: string): string {
  return openid ? openid.slice(0, 6) + '***' : ''
}

/**
 * 调用云函数并解析统一返回结构
 * @throws Error 网络失败或业务错误时抛出，msg 为可读信息
 */
export async function callFunction<T>(
  name: string,
  action: string,
  data: Record<string, unknown> = {},
  retryCount = 0
): Promise<T> {
  try {
    const res = await Taro.cloud.callFunction({
      name,
      data: { action, ...data },
      // Taro 类型未暴露 timeout 字段，运行时透传给 wx.cloud.callFunction
      timeout: REQUEST_TIMEOUT
    } as Taro.cloud.CallFunctionParam)
    const result = res.result as CloudResult<T>
    if (!result || typeof result.code !== 'number') {
      console.error(`[services] ${name}.${action} 返回结构异常:`, res.result)
      throw new Error('云函数返回结构异常')
    }
    if (result.code !== 0) {
      console.error(`[services] ${name}.${action} 业务错误 code=${result.code} msg=${result.msg}`)
      throw new Error(result.msg || `业务错误 ${result.code}`)
    }
    return result.data
  } catch (err) {
    // 网络类异常重试一次；业务错误直接抛出
    const isNetworkError = !(err instanceof Error && err.message.includes('业务错误'))
    if (isNetworkError && retryCount < MAX_RETRY) {
      console.warn(`[services] ${name}.${action} 网络异常，重试第 ${retryCount + 1} 次`)
      return callFunction<T>(name, action, data, retryCount + 1)
    }
    throw err
  }
}
