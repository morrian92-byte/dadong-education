import { useState, useEffect } from 'react'
import { authApi } from '../../utils/api'

interface PendingUser { id: number; username: string; role: string; phone: string; status: string; created_at: string }

export default function PendingUsers() {
  const [tab, setTab] = useState<'student' | 'teacher'>('student')
  const [users, setUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch(`/api/admin/pending-users?role=${tab}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json()).then(setUsers).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [tab])

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    await fetch(`/api/admin/users/${id}/${action}`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">用户审批</h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('student')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'student' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'}`}>
          👨‍🎓 学生审批
        </button>
        <button onClick={() => setTab('teacher')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'teacher' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'}`}>
          👨‍🏫 教师审批
        </button>
      </div>

      {loading ? <p className="text-slate-400 text-center py-8">加载中...</p>
        : users.length === 0 ? <div className="bg-white rounded-xl p-8 text-center border"><p className="text-slate-400">暂无待审批{tab === 'student' ? '学生' : '教师'}</p></div>
          : <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{u.username}</p>
                  <p className="text-sm text-slate-400">{u.phone} · {u.created_at?.split('T')[0]}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(u.id, 'approve')} className="bg-green-50 text-green-600 px-4 py-1.5 rounded-lg text-sm hover:bg-green-100">通过</button>
                  <button onClick={() => handleAction(u.id, 'reject')} className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-sm hover:bg-red-100">拒绝</button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
