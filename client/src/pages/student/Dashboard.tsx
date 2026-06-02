import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingsApi } from '../../utils/api'
import { useAuth } from '../../hooks/useAuth'
import type { Booking } from '../../types'

export default function StudentDashboard() {
  const { user, logout, isLoggedIn } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) { nav('/login'); return }
    bookingsApi.myBookings()
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id: number) => {
    if (!confirm('确定取消这个约课申请吗？')) return
    try {
      await bookingsApi.cancel(id)
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b))
    } catch {}
  }

  const handleLogout = () => { logout(); nav('/') }

  const statusLabel: Record<string, string> = {
    pending: '⏳ 等待审批', approved: '✅ 已通过', rejected: '❌ 已拒绝', cancelled: '🚫 已取消',
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">我的约课</h1>
          <p className="text-slate-500 text-sm mt-1">你好，{user?.username}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => nav('/courses')} className="text-blue-600 hover:underline text-sm">去选课</button>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 text-sm">退出</button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-12">加载中...</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <span className="text-4xl">📋</span>
          <p className="text-slate-500 mt-3">还没有约课记录</p>
          <button onClick={() => nav('/courses')} className="mt-4 text-blue-600 hover:underline">去浏览课程</button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{b.course?.title || `课程 #${b.course_id}`}</p>
                <p className="text-sm text-slate-400 mt-1">{b.created_at?.split('T')[0]}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">{statusLabel[b.status] || b.status}</span>
                {b.status === 'pending' && (
                  <button onClick={() => handleCancel(b.id)} className="text-red-500 hover:text-red-700 text-sm">取消</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
