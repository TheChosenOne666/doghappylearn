/** 今日任务 Store（M0 骨架，M2 实现题包缓存与离线队列） */
import { create } from 'zustand'
import type { DailyTask, EnsureTodayResult } from '../services/task'

interface TaskState {
  date: string
  tasks: DailyTask[]
  questionPack: EnsureTodayResult['questionPack'] | null
  offlineQueue: unknown[]
  setToday: (result: EnsureTodayResult) => void
  enqueueOffline: (payload: unknown) => void
}

export const useTaskStore = create<TaskState>((set) => ({
  date: '',
  tasks: [],
  questionPack: null,
  offlineQueue: [],
  setToday: (result) =>
    set({ date: result.date, tasks: result.tasks, questionPack: result.questionPack }),
  enqueueOffline: (payload) => set((s) => ({ offlineQueue: [...s.offlineQueue, payload] }))
}))
