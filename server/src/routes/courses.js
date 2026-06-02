import { Router } from 'express'
import supabase from '../supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// 公开 — 获取所有课程
router.get('/', async (req, res) => {
  const { category, featured } = req.query

  let query = supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }
  if (featured === 'true') {
    query = query.eq('featured', 1)
  }

  const { data: courses, error } = await query

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(courses)
})

// 公开 — 获取单个课程
router.get('/:id', async (req, res) => {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  if (!course) {
    return res.status(404).json({ error: '课程不存在' })
  }

  res.json(course)
})

// 需要认证 — 创建课程
router.post('/', authMiddleware, async (req, res) => {
  const { title, category, description, outline, price, image, featured } = req.body
  if (!title || !category) {
    return res.status(400).json({ error: '标题和分类为必填项' })
  }

  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      title,
      category,
      description: description || '',
      outline: outline || '',
      price: price || '',
      image: image || '',
      featured: featured ? 1 : 0,
    })
    .select()
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json(course)
})

// 需要认证 — 更新课程
router.put('/:id', authMiddleware, async (req, res) => {
  // 先检查是否存在
  const { data: existing, error: findErr } = await supabase
    .from('courses')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (findErr) {
    return res.status(500).json({ error: findErr.message })
  }
  if (!existing) {
    return res.status(404).json({ error: '课程不存在' })
  }

  const { title, category, description, outline, price, image, featured } = req.body

  const updateData = {}
  if (title !== undefined) updateData.title = title
  if (category !== undefined) updateData.category = category
  if (description !== undefined) updateData.description = description
  if (outline !== undefined) updateData.outline = outline
  if (price !== undefined) updateData.price = price
  if (image !== undefined) updateData.image = image
  if (featured !== undefined) updateData.featured = featured ? 1 : 0
  updateData.updated_at = new Date().toISOString()

  const { data: updated, error } = await supabase
    .from('courses')
    .update(updateData)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(updated)
})

// 需要认证 — 删除课程
router.delete('/:id', authMiddleware, async (req, res) => {
  const { data: existing, error: findErr } = await supabase
    .from('courses')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (findErr) {
    return res.status(500).json({ error: findErr.message })
  }
  if (!existing) {
    return res.status(404).json({ error: '课程不存在' })
  }

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ message: '删除成功' })
})

export default router
