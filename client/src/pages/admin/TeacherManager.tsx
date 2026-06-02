import { useState, useEffect } from 'react'
import { teachersApi } from '../../utils/api'
import Modal from '../../components/ui/Modal'
import type { Teacher } from '../../types'

const emptyForm = { name: '', title: '', bio: '', specialties: '' }

export default function TeacherManager() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => {
    teachersApi.getAll().then(res => setTeachers(res.data)).catch(() => {})
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (t: Teacher) => {
    setEditingId(t.id)
    setForm({ name: t.name, title: t.title, bio: t.bio, specialties: t.specialties })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name) return alert('请输入教师姓名')
    setSaving(true)
    try {
      if (editingId) await teachersApi.update(editingId, form)
      else await teachersApi.create(form)
      setModalOpen(false)
      load()
    } catch { setModalOpen(false); load() }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此教师吗？')) return
    try { await teachersApi.delete(id); load() } catch { load() }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">教师管理</h1>
          <p className="text-slate-500 text-sm mt-1">共 {teachers.length} 位教师</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">+ 新增教师</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-slate-600">姓名</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600 hidden md:table-cell">职称</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600 hidden lg:table-cell">擅长领域</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {teachers.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-medium text-slate-800">{t.name}</td>
                <td className="py-3 px-4 text-slate-500 hidden md:table-cell">{t.title}</td>
                <td className="py-3 px-4 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {t.specialties?.split(',').map(s => (
                      <span key={s} className="bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded text-xs">{s.trim()}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => openEdit(t)} className="text-primary-600 hover:text-primary-800 mr-3">编辑</button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '编辑教师' : '新增教师'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">姓名 *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">职称</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">个人简介</label>
            <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">擅长领域（逗号分隔）</label>
            <input type="text" value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary-500" placeholder="如：阅读理解,作文指导,古文鉴赏" />
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
