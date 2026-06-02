import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import courseRoutes from './routes/courses.js'
import teacherRoutes from './routes/teachers.js'
import newsRoutes from './routes/news.js'
import contactRoutes from './routes/contact.js'
import dashboardRoutes from './routes/dashboard.js'

const app = express()
const PORT = process.env.PORT || 4000

// 中间件
app.use(cors())
app.use(express.json())

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/dashboard', dashboardRoutes)

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// 本地开发启动 server，生产环境（Vercel）不 listen
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 大东教育后端服务已启动: http://localhost:${PORT}`)
  })
}

export default app
