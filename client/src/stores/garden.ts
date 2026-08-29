/** 成长花园 Store（M0 骨架：不持久化，以云端为准，本地仅动画加速） */
import { create } from 'zustand'
import { getGarden, GardenState } from '../services/garden'

interface GardenStoreState extends GardenState {
  loading: boolean
  refresh: () => Promise<void>
}

export const useGardenStore = create<GardenStoreState>((set) => ({
  growth: 0,
  flowers: 0,
  scenes: [],
  loading: false,
  refresh: async () => {
    set({ loading: true })
    try {
      const garden = await getGarden()
      set({ ...garden, loading: false })
    } catch (err) {
      console.warn('[gardenStore] 花园状态拉取失败（云端可能未就绪）:', err)
      set({ loading: false })
    }
  }
}))
