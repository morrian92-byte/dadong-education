import { Router } from 'express'
import supabase from '../supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// 公开 — 提交联系表单
router.post('/', async (req, res) => {
  const { name, phone, email, message } = req.body
  if (!name || !phone) {
    return res.status(400).json({ error: '姓名和电话为必填项' })
  }

  const { error } = await supabase
    .from('contacts')
    .insert({ name, phone, email: email || '', message: message || '' })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json({ message: '提交成功，我们将尽快与您联系' })
})

// 需要认证 — 获取所有留言
router.get('/', authMiddleware, async (_req, res) => {
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(contacts)
})

// 需要认证 — 删除留言
router.delete('/:id', authMiddleware, async (req, res) => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ message: '删除成功' })
})

export default router
