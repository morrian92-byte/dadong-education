import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingsApi } from '../../utils/api'
import { useAuth } from '../../hooks/useAuth'
import type { Booking } from '../../types'

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '⏳ 等待老师处理', color: 'text-yellow-600 bg-yellow-50' },
  teacher_picked: { label: '📌 老师已选时间，请确认', color: 'text-blue-600 bg-blue-50' },
  confirmed: { label: '✅ 已确认', color: 'text-green-600 bg-green-50' },
  rejected: { label: '❌ 已拒绝', color: 'text-red-600 bg-red-50' },
  cancelled: { label: '🚫 已取消', color: 'text-gray-600 bg-gray-50' },
}

export default function StudentDashboard() {
  const { user, logout, isLoggedIn } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) { nav('/login'); return }
    bookingsApi.myBookings().then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleConfirm = async (id: number) => {
    if (!confirm('确认该时间？确认后约课即刻生效。')) return
    try {
      await bookingsApi.confirm(id)
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status: 'confirmed' } : b))
    } catch {}
  }

  const handleCancel = async (id: number) => {
    if (!confirm('确定取消？')) return
    try {
      await bookingsApi.cancel(id)
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b))
    } catch {}
  }

  const parseOptions = (opts: string) => {
    try { return JSON.parse(opts) as string[] } catch { return [] }
  }

  const handleLogout = () => { logout(); nav('/') }

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

      {loading ? <p className="text-slate-400 text-center py-12">加载中...</p>
        : bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
            <span className="text-4xl">📋</span>
            <p className="text-slate-500 mt-3">还没有约课记录</p>
            <button onClick={() => nav('/courses')} className="mt-4 text-blue-600 hover:underline">去浏览课程</button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => {
              const st = statusMap[b.status] || { label: b.status, color: 'text-slate-600 bg-slate-50' }
              const options = parseOptions(b.time_options || '[]')
              return (
                <div key={b.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{b.course?.title || `课程 #${b.course_id}`}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{b.created_at?.split('T')[0]}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm px-3 py-1 rounded-full ${st.color}`}>{st.label}</span>
                      {b.status === 'teacher_picked' && (
                        <>
                          <span className="text-sm font-medium text-blue-700">时间：{b.selected_time}</span>
                          <button onClick={() => handleConfirm(b.id)}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700">确认</button>
                        </>
                      )}
                      {['pending', 'teacher_picked'].includes(b.status) && (
                        <button onClick={() => handleCancel(b.id)} className="text-red-500 hover:text-red-700 text-sm">取消</button>
                      )}
                    </div>
                  </div>
                  {options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs text-slate-500">可选时间：</span>
                      {options.map((t: string, i: number) => (
                        <span key={i} className="text-xs bg-gray-100 text-slate-600 px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
    </div>
  )
}
