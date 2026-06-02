import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingsApi } from '../../utils/api'
import { useAuth } from '../../hooks/useAuth'
import type { Booking } from '../../types'

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    bookingsApi.teacherBookings()
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await bookingsApi.review(id, status)
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b))
    } catch {}
  }

  const statusLabel: Record<string, string> = {
    pending: '⏳ 待处理', approved: '✅ 已通过', rejected: '❌ 已拒绝', cancelled: '🚫 已取消',
  }

  const pendingCount = bookings.filter(b => b.status === 'pending').length

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">学生约课管理</h1>
          <p className="text-slate-500 text-sm mt-1">
            {user?.username} 老师 · {pendingCount} 条待处理
          </p>
        </div>
        <button onClick={() => { logout(); nav('/') }} className="text-slate-400 hover:text-red-500 text-sm">退出</button>
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-12">加载中...</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <span className="text-4xl">📭</span>
          <p className="text-slate-500 mt-3">暂无学生约课</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">
                    {b.student?.username || `学生 #${b.student_id}`}
                    {b.student?.phone && <span className="text-slate-400 text-sm ml-2">{b.student.phone}</span>}
                  </p>
                  <p className="text-slate-500 text-sm mt-0.5">
                    课程：{b.course?.title || `#${b.course_id}`}
                    {b.message && <span className="text-slate-400 ml-2">— {b.message}</span>}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{b.created_at?.split('T')[0]}</p>
                </div>
                <div className="flex items-center gap-3">
                  {b.status === 'pending' ? (
                    <>
                      <button onClick={() => handleReview(b.id, 'approved')}
                        className="bg-green-50 text-green-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-100">
                        通过
                      </button>
                      <button onClick={() => handleReview(b.id, 'rejected')}
                        className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100">
                        拒绝
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-slate-500">{statusLabel[b.status]}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
