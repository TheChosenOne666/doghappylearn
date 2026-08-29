/**
 * 云函数批量部署脚本（任务 0.4）
 * 用法：node deploy.mjs <envId> [函数名...]
 *   envId   云开发环境 ID，如 dev-xxxx
 *   不传函数名则部署全部 8 个
 * 依赖：npx -y @cloudbase/cli（首次运行会自动安装；需先 `npx tcb login` 完成登录）
 */
import { execSync } from 'node:child_process'

const ALL_FUNCTIONS = [
  'profile',
  'task',
  'garden',
  'report',
  'print',
  'track',
  'cron-reminder',
  'pipeline'
]

const [envId, ...targets] = process.argv.slice(2)
if (!envId) {
  console.error('用法: node deploy.mjs <envId> [函数名...]，如: node deploy.mjs dev-xxxx profile')
  process.exit(1)
}
const fns = targets.length > 0 ? targets : ALL_FUNCTIONS

for (const fn of fns) {
  if (!ALL_FUNCTIONS.includes(fn)) {
    console.error(`未知函数: ${fn}（可选: ${ALL_FUNCTIONS.join(', ')}）`)
    process.exit(1)
  }
  console.log(`>>> 部署 ${fn} -> ${envId}`)
  execSync(
    `npx -y @cloudbase/cli@latest fn deploy ${fn} --dir functions/${fn} -e ${envId} --force`,
    { stdio: 'inherit' }
  )
}
console.log('全部部署完成')
