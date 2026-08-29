/** 防沉迷计时 Store（架构文档 §3.3 / FR-B5，M0 骨架：按日持久化，M2 接入 onShow/onHide 计时） */
import { create } from 'zustand'
import Taro from '@tarojs/taro'

const STORAGE_KEY = 'screen_time_today'

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

interface ScreenTimeState {
  date: string
  /** 当日累计前台活跃毫秒数 */
  activeMs: number
  /** 是否已达上限锁定（仅锁游戏入口） */
  locked: boolean
  addActive: (ms: number, limitMin: number) => void
}

export const useScreenTimeStore = create<ScreenTimeState>((set, get) => {
  const saved = Taro.getStorageSync(STORAGE_KEY) as { date: string; activeMs: number } | ''
  const initial = saved && saved.date === todayKey() ? saved : { date: todayKey(), activeMs: 0 }
  return {
    ...initial,
    locked: false,
    addActive: (ms, limitMin) => {
      const state = get()
      // 跨日重置
      if (state.date !== todayKey()) {
        set({ date: todayKey(), activeMs: ms, locked: false })
        Taro.setStorageSync(STORAGE_KEY, { date: todayKey(), activeMs: ms })
        return
      }
      const activeMs = state.activeMs + ms
      const locked = activeMs >= limitMin * 60 * 1000
      set({ activeMs, locked })
      Taro.setStorageSync(STORAGE_KEY, { date: state.date, activeMs })
    }
  }
})
