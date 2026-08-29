import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import '@nutui/nutui-react-taro/dist/style.css'
import { useProfileStore } from './stores/profile'

import './app.scss'

/** 小程序入口：初始化云开发环境并静默建档（FR-N1 新用户激活第一步） */
function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    const env = process.env.TARO_APP_CLOUD_ENV
    if (!env) {
      console.error('[app] 未配置 TARO_APP_CLOUD_ENV，云函数调用将失败')
      return
    }
    if (Taro.cloud.init) {
      Taro.cloud.init({ env, traceUser: true })
      console.log('[app] 云开发环境初始化完成:', env)
    }
    useProfileStore.getState().ensureProfile()
  })

  // children 是将要会渲染的页面
  return children
}

export default App
