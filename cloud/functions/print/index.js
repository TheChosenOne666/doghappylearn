/**
 * 云函数骨架（M0）：统一返回 { code, msg, data }。
 * 业务逻辑在 M1 按方案文档 §4 各任务充实。
 */
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const action = event.action || ''
  const { OPENID } = cloud.getWXContext()
  console.log(JSON.stringify({ fn: 'print', action, openid: OPENID ? OPENID.slice(0, 6) + '***' : '' }))

  switch (action) {
    // 统一返回结构连通性验证（M0 验收：hello world 通）
    case 'ping':
      return { code: 0, msg: '', data: { pong: true, fn: 'print', ts: Date.now() } }
    default:
      return { code: 9999, msg: 'M0 骨架：action 未实现（M1 交付）', data: null }
  }
}
