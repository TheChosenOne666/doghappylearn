/** garden 域接口封装（M1 完成后对接真实云函数） */
import { callFunction } from './request'

export interface GardenState {
  growth: number
  flowers: number
  pet?: string
  scenes: string[]
}

export function getGarden() {
  return callFunction<GardenState>('garden', 'get')
}

export function exchangeGardenItem(itemId: string) {
  return callFunction<GardenState>('garden', 'exchange', { itemId })
}
