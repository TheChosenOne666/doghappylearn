/** 用户档案 Store（架构文档 §3.2，M0 骨架：仅本地态，M1 对接 profile 云函数后收敛为云端为准） */
import { create } from 'zustand'
import Taro from '@tarojs/taro'
import * as profileService from '../services/profile'

export type AgeBand = '4-6' | '6-8'

interface ProfileState {
  openid: string
  ageBand: AgeBand | null
  onboardDone: boolean
  streakDays: number
  screenTimeLimitMin: number
  loading: boolean
  /** 静默建档 + 拉取档案摘要 */
  ensureProfile: () => Promise<void>
  setAgeBand: (band: AgeBand) => void
}

const STORAGE_KEY = 'profile_cache'

export const useProfileStore = create<ProfileState>((set, get) => ({
  openid: '',
  ageBand: null,
  onboardDone: false,
  streakDays: 0,
  screenTimeLimitMin: 15,
  loading: false,

  ensureProfile: async () => {
    // 本地缓存先行，云端返回后收敛
    const cached = Taro.getStorageSync(STORAGE_KEY) as Partial<ProfileState> | ''
    if (cached && cached.ageBand) {
      set({ ...cached, loading: false })
    }
    set({ loading: true })
    try {
      await profileService.ensureProfile()
      const summary = await profileService.getProfile()
      const next = {
        ageBand: summary.ageBand as AgeBand,
        onboardDone: summary.onboardDone,
        streakDays: summary.streakDays,
        screenTimeLimitMin: summary.screenTimeLimitMin
      }
      set({ ...next, loading: false })
      Taro.setStorageSync(STORAGE_KEY, next)
    } catch (err) {
      // M0 阶段云函数尚未部署，静默降级为本地缓存态
      console.warn('[profileStore] 档案拉取失败（云端可能未就绪）:', err)
      set({ loading: false })
    }
  },

  setAgeBand: (band) => {
    set({ ageBand: band })
    const cached = Taro.getStorageSync(STORAGE_KEY) || {}
    Taro.setStorageSync(STORAGE_KEY, { ...cached, ageBand: band })
    if (!get().onboardDone) {
      // onboarding 流程在 M2 实现，此处仅记录意图
      console.log('[profileStore] 选择龄段:', band)
    }
  }
}))
