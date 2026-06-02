import { useState, useEffect } from 'react'

interface PendingCourse { id: number; title: string; category: string; teacher_id: number; created_at: string }

export default function PendingCourses() {
  const [courses, setCourses] = useState<PendingCourse[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch('/api/admin/pending-courses', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json()).then(setCourses).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    await fetch(`/api/admin/courses/${id}/${action}`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    setCourses(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">课程审批</h1>

      {loading ? <p className="text-slate-400 text-center py-8">加载中...</p>
        : courses.length === 0 ? <div className="bg-white rounded-xl p-8 text-center border"><p className="text-slate-400">暂无待审批课程</p></div>
          : <div className="space-y-3">
            {courses.map(c => (
              <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{c.title}</p>
                  <p className="text-sm text-slate-400">{c.category} · 教师ID: {c.teacher_id} · {c.created_at?.split('T')[0]}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(c.id, 'approve')} className="bg-green-50 text-green-600 px-4 py-1.5 rounded-lg text-sm hover:bg-green-100">通过</button>
                  <button onClick={() => handleAction(c.id, 'reject')} className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-sm hover:bg-red-100">拒绝</button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
