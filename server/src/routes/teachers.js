import { Router } from 'express'
import supabase from '../supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// 公开 — 获取所有教师
router.get('/', async (_req, res) => {
  const { data: teachers, error } = await supabase
    .from('teachers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(teachers)
})

// 公开 — 获取单个教师
router.get('/:id', async (req, res) => {
  const { data: teacher, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  if (!teacher) {
    return res.status(404).json({ error: '教师不存在' })
  }

  res.json(teacher)
})

// 需要认证 — 创建教师
router.post('/', authMiddleware, async (req, res) => {
  const { name, title, bio, avatar, specialties } = req.body
  if (!name) {
    return res.status(400).json({ error: '姓名为必填项' })
  }

  const { data: teacher, error } = await supabase
    .from('teachers')
    .insert({
      name,
      title: title || '',
      bio: bio || '',
      avatar: avatar || '',
      specialties: specialties || '',
    })
    .select()
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json(teacher)
})

// 需要认证 — 更新教师
router.put('/:id', authMiddleware, async (req, res) => {
  const { data: existing, error: findErr } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (findErr) {
    return res.status(500).json({ error: findErr.message })
  }
  if (!existing) {
    return res.status(404).json({ error: '教师不存在' })
  }

  const { name, title, bio, avatar, specialties } = req.body
  const updateData = {}
  if (name !== undefined) updateData.name = name
  if (title !== undefined) updateData.title = title
  if (bio !== undefined) updateData.bio = bio
  if (avatar !== undefined) updateData.avatar = avatar
  if (specialties !== undefined) updateData.specialties = specialties

  const { data: updated, error } = await supabase
    .from('teachers')
    .update(updateData)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(updated)
})

// 需要认证 — 删除教师
router.delete('/:id', authMiddleware, async (req, res) => {
  const { data: existing, error: findErr } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (findErr) {
    return res.status(500).json({ error: findErr.message })
  }
  if (!existing) {
    return res.status(404).json({ error: '教师不存在' })
  }

  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ message: '删除成功' })
})

export default router
