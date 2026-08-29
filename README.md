# 《趣狗乐学》

儿童学习小程序（微信）。设计文档见根目录各 `.md`，PRD 在 `qugou-lexue-prd/`，原型图在 `原型图/`。

## 结构（pnpm monorepo）

```
client/          前端 Taro 4 + React + TS
cloud/functions/ 微信云函数（8 个）
shared/          前后端共享类型与纯逻辑
```

## 常用命令

```bash
pnpm install                # 安装依赖
pnpm dev:weapp              # 前端 watch 编译（微信开发者工具打开仓库根目录）
pnpm build:weapp            # 前端生产编译
pnpm lint                   # 各包 lint
pnpm test                   # 单元测试（M1 起生效）

# 云函数（先 npx tcb login 登录 CloudBase）
cd cloud
node deploy.mjs <envId>              # 部署全部 8 个函数
node deploy.mjs <envId> profile task # 部署指定函数
pnpm smoke:pdfkit                    # pdfkit 中文 PDF 冒烟验证
```

## 待办（部署前必填）

1. `project.config.json` / `client/project.config.json` 的 `appid` 换成真实 AppID
2. `client/.env.development` / `.env.production` 的 `TARO_APP_CLOUD_ENV` 换成真实云开发环境 ID
3. 云数据库集合与权限按《架构设计文档》§5 创建
