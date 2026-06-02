import { useState, useEffect } from 'react'

export default function AllSchedules() {
  const [data, setData] = useState<{ courses: any[]; bookings: any[] }>({ courses: [], bookings: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/all-schedules', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const statusLabel: Record<string, string> = {
    pending: '⏳ 待处理', teacher_picked: '📌 待确认', confirmed: '✅ 已确认', rejected: '❌ 已拒绝', cancelled: '🚫 已取消',
  }

  if (loading) return <p className="text-slate-400 text-center py-8">加载中...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">全景课表</h1>

      {data.courses.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border mb-6"><p className="text-slate-400">暂无课程</p></div>
      ) : (
        <div className="space-y-6">
          {data.courses.map((c: any) => {
            const courseBookings = data.bookings.filter((b: any) => b.course_id === c.id)
            return (
              <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">{c.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {c.status}
                  </span>
                </div>
                {courseBookings.length === 0 ? (
                  <p className="text-sm text-slate-400">暂无约课</p>
                ) : (
                  <div className="space-y-2">
                    {courseBookings.map((b: any) => (
                      <div key={b.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                        <span>学生ID: {b.student_id} | {statusLabel[b.status] || b.status}</span>
                        <span className="text-slate-400">
                          {b.selected_time ? `时间: ${b.selected_time}` : b.time_options ? `可选: ${b.time_options}` : ''}
                        </span>
                      </div>
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
