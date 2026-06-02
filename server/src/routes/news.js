import { Router } from 'express'
import supabase from '../supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// 公开 — 获取所有新闻（分页）
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const offset = (page - 1) * limit

  // 获取总数
  const { count: total, error: countErr } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })

  if (countErr) {
    return res.status(500).json({ error: countErr.message })
  }

  // 获取分页数据
  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ news, total })
})

// 公开 — 获取单篇新闻
router.get('/:id', async (req, res) => {
  const { data: article, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  if (!article) {
    return res.status(404).json({ error: '文章不存在' })
  }

  res.json(article)
})

// 需要认证 — 创建新闻
router.post('/', authMiddleware, async (req, res) => {
  const { title, summary, content, cover_image, category, published_at } = req.body
  if (!title) {
    return res.status(400).json({ error: '标题为必填项' })
  }

  const { data: article, error } = await supabase
    .from('news')
    .insert({
      title,
      summary: summary || '',
      content: content || '',
      cover_image: cover_image || '',
      category: category || '机构动态',
      published_at: published_at || new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json(article)
})

// 需要认证 — 更新新闻
router.put('/:id', authMiddleware, async (req, res) => {
  const { data: existing, error: findErr } = await supabase
    .from('news')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (findErr) {
    return res.status(500).json({ error: findErr.message })
  }
  if (!existing) {
    return res.status(404).json({ error: '文章不存在' })
  }

  const { title, summary, content, cover_image, category, published_at } = req.body
  const updateData = {}
  if (title !== undefined) updateData.title = title
  if (summary !== undefined) updateData.summary = summary
  if (content !== undefined) updateData.content = content
  if (cover_image !== undefined) updateData.cover_image = cover_image
  if (category !== undefined) updateData.category = category
  if (published_at !== undefined) updateData.published_at = published_at

  const { data: updated, error } = await supabase
    .from('news')
    .update(updateData)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(updated)
})

// 需要认证 — 删除新闻
router.delete('/:id', authMiddleware, async (req, res) => {
  const { data: existing, error: findErr } = await supabase
    .from('news')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (findErr) {
    return res.status(500).json({ error: findErr.message })
  }
  if (!existing) {
    return res.status(404).json({ error: '文章不存在' })
  }

  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ message: '删除成功' })
})

export default router
