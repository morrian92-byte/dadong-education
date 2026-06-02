import { useState, useEffect } from 'react'
import { newsApi } from '../../utils/api'
import Modal from '../../components/ui/Modal'
import type { News } from '../../types'

const emptyForm = { title: '', summary: '', content: '', category: '机构动态' }
const categories = ['通知公告', '机构动态', '学习方法', '社会责任']

export default function NewsManager() {
  const [news, setNews] = useState<News[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => {
    newsApi.getAll({ limit: 100 })
      .then(res => setNews(res.data.news))
      .catch(() => {})
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (n: News) => {
    setEditingId(n.id)
    setForm({ title: n.title, summary: n.summary, content: n.content, category: (n as any).category || '机构动态' })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title) return alert('请输入新闻标题')
    setSaving(true)
    const payload = { ...form, published_at: new Date().toISOString().split('T')[0] }
    try {
      if (editingId) await newsApi.update(editingId, payload)
      else await newsApi.create(payload)
      setModalOpen(false)
      load()
    } catch { setModalOpen(false); load() }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此新闻吗？')) return
    try { await newsApi.delete(id); load() } catch { load() }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">新闻管理</h1>
          <p className="text-slate-500 text-sm mt-1">共 {news.length} 篇文章</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">+ 发布新闻</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-slate-600">标题</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600 hidden md:table-cell">分类</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600 hidden sm:table-cell">发布日期</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {news.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">{n.title}</td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                    {(n as any).category || '机构动态'}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 hidden sm:table-cell">{n.published_at}</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => openEdit(n)} className="text-primary-600 hover:text-primary-800 mr-3">编辑</button>
                  <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:text-red-700">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '编辑新闻' : '发布新闻'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">标题 *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">摘要</label>
            <textarea rows={2} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">正文内容</label>
            <textarea rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500 resize-none" placeholder="支持多行文本..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 text-sm py-2">
              {saving ? '保存中...' : '保存'}
            </button>
            <button onClick={() => setModalOpen(false)} className="btn-outline flex-1 text-sm py-2">取消</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
