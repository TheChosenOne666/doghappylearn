/**
 * pdfkit 最小验证脚本（任务 0.4：提前验证中文字体渲染与包体积方案，规避 M3 排版风险）
 * 用法：node pdfkit-smoke.js
 * 输出：pdfkit-smoke.pdf（A4 一页，含中文标题 + 口算算式行）
 * 字体：通过环境变量 FONT_PATH 指定本地 TTF（Windows 默认黑体）；
 *       部署云函数时需换成子集化字体文件（<2MB）随函数打包。
 */
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const FONT_PATH = process.env.FONT_PATH || 'C:/Windows/Fonts/simhei.ttf'

async function main() {
  if (!fs.existsSync(FONT_PATH)) {
    console.error(`[pdfkit-smoke] 找不到字体文件: ${FONT_PATH}，请通过 FONT_PATH 环境变量指定 TTF 字体`)
    process.exit(1)
  }
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const outPath = path.join(__dirname, 'pdfkit-smoke.pdf')
  const stream = fs.createWriteStream(outPath)
  doc.pipe(stream)

  doc.font(FONT_PATH).fontSize(24).text('趣狗乐学 · 口算练习纸', { align: 'center' })
  doc.moveDown(1).fontSize(14)
  for (let i = 1; i <= 10; i++) {
    const a = Math.ceil(Math.random() * 9)
    const b = Math.ceil(Math.random() * (10 - a))
    doc.text(`${String(i).padStart(2, ' ')}.  ${a} + ${b} = ____`)
  }
  doc.end()

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve)
    stream.on('error', reject)
  })
  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1)
  console.log(`[pdfkit-smoke] 生成成功: ${outPath} (${sizeKB} KB)`)
}

main().catch((err) => {
  console.error('[pdfkit-smoke] 生成失败:', err)
  process.exit(1)
})
