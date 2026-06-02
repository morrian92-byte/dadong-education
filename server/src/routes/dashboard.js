import { Router } from 'express'
import supabase from '../supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/stats', authMiddleware, async (_req, res) => {
  const tables = ['courses', 'teachers', 'news', 'contacts']
  const stats = {}

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    stats[table] = count
  }

  res.json(stats)
})

export default router
