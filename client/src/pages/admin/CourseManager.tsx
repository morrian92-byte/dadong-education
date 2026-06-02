import { useState, useEffect } from 'react'
import { coursesApi } from '../../utils/api'
import Modal from '../../components/ui/Modal'
import type { Course } from '../../types'

const emptyForm = {
  title: '', category: '小学辅导', description: '', outline: '', price: '', featured: false,
}

const categories = ['小学辅导', '初中辅导', '中考冲刺', '高中辅导']

export default function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadCourses = () => {
    coursesApi.getAll()
      .then(res => setCourses(res.data))
      .catch(() => {
        // 演示数据
        setCourses([
          { id: 1, title: '小学语文阅读写作班', category: '小学辅导', description: '培养阅读兴趣', outline: '', price: '¥2,980/期', image: '', featured: true, created_at: '', updated_at: '' },
        ])
      })
  }

  useEffect(() => { loadCourses() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditingId(course.id)
    setForm({
      title: course.title,
      category: course.category,
      description: course.description,
      outline: course.outline,
      price: course.price,
      featured: course.featured,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title) return alert('请输入课程标题')
    setSaving(true)
    try {
      if (editingId) {
        await coursesApi.update(editingId, form)
      } else {
        await coursesApi.create(form)
      }
      setModalOpen(false)
      loadCourses()
    } catch {
      // 演示模式：直接刷新
      setModalOpen(false)
      loadCourses()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此课程吗？')) return
    try {
      await coursesApi.delete(id)
      loadCourses()
    } catch {
      loadCourses()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">课程管理</h1>
          <p className="text-slate-500 text-sm mt-1">共 {courses.length} 门课程</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">
          + 新增课程
        </button>
      </div>

      {/* 课程列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-slate-600">课程名称</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600 hidden md:table-cell">分类</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600 hidden md:table-cell">价格</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600 hidden sm:table-cell">推荐</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {courses.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-800">{c.title}</td>
                <td className="py-3 px-4 text-slate-500 hidden md:table-cell">
                  <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full text-xs">{c.category}</span>
                </td>
                <td className="py-3 px-4 text-slate-600 hidden md:table-cell">{c.price}</td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  {c.featured ? <span className="text-green-500">⭐</span> : <span className="text-slate-300">—</span>}
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => openEdit(c)} className="text-primary-600 hover:text-primary-800 mr-3">编辑</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 新建/编辑弹窗 */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '编辑课程' : '新增课程'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">课程标题 *</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">价格</label>
            <input type="text" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500" placeholder="如：¥2,980/期" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">课程描述</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">课程大纲</label>
            <textarea rows={4} value={form.outline} onChange={e => setForm({ ...form, outline: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500 resize-none" placeholder="每行一个条目" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 rounded accent-primary-600" />
            <span className="text-sm text-slate-700">设为推荐课程</span>
          </label>
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
