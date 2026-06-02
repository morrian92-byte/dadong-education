import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingsApi } from '../../utils/api'
import { useAuth } from '../../hooks/useAuth'
import type { Booking, Course } from '../../types'

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'bookings' | 'courses' | 'create'>('bookings')

  // 创建课程表单
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  const nav = useNavigate()

  const load = () => {
    setLoading(true)
    Promise.all([
      bookingsApi.teacherBookings().then(r => setBookings(r.data)).catch(() => {}),
      bookingsApi.myCourses().then(r => setCourses(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handlePickTime = async (id: number, time: string) => {
    try {
      await bookingsApi.pickTime(id, time)
      load()
    } catch {}
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !category) { setMsg('请填写标题和分类'); return }
    setSubmitting(true)
    try {
      await bookingsApi.createCourse({ title, category, description, price })
      setMsg('课程已提交，等待管理员审批')
      setTitle(''); setCategory(''); setDescription(''); setPrice('')
      load()
    } catch { setMsg('提交失败') }
    finally { setSubmitting(false) }
  }

  const parseOptions = (opts: string) => {
    try { return JSON.parse(opts) as string[] } catch { return [] }
  }

  const statusMap: Record<string, string> = {
    pending: '⏳ 待处理', teacher_picked: '📌 已选时间', confirmed: '✅ 已确认',
    rejected: '❌ 已拒绝', cancelled: '🚫 已取消',
  }

  const pendingCount = bookings.filter(b => b.status === 'pending').length

  if (loading) return <div className="max-w-4xl mx-auto py-10 px-4"><p className="text-slate-400 text-center">加载中...</p></div>

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">教师工作台</h1>
          <p className="text-slate-500 text-sm mt-1">{user?.username} · {pendingCount} 条待处理</p>
        </div>
        <button onClick={() => { logout(); nav('/') }} className="text-slate-400 hover:text-red-500 text-sm">退出</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['bookings', 'courses', 'create'].map(t => (
          <button key={t} onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t ? 'bg-blue-600 text-white' : 'bg-white border text-slate-600'}`}>
            {t === 'bookings' ? '📋 学生约课' : t === 'courses' ? '📚 我的课程' : '➕ 创建课程'}
          </button>
        ))}
      </div>

      {/* 创建课程 */}
      {tab === 'create' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h2 className="font-semibold text-lg mb-4">提交新课程（需管理员审批）</h2>
          {msg && <div className="bg-blue-50 text-blue-600 text-sm rounded-lg p-3 mb-4">{msg}</div>}
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <input type="text" placeholder="课程标题" value={title} onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="text" placeholder="分类（如：小学辅导）" value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
            <textarea placeholder="课程描述" value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
            <input type="text" placeholder="价格（如：¥2,980/期）" value={price} onChange={e => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
              {submitting ? '提交中...' : '提交审批'}
            </button>
          </form>
        </div>
      )}

      {/* 我的课程 */}
      {tab === 'courses' && (
        courses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border"><p className="text-slate-400">暂无课程</p></div>
        ) : (
          <div className="space-y-3">
            {courses.map(c => (
              <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{c.title}</p>
                  <p className="text-sm text-slate-400">{c.category} · {c.price}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {c.status === 'approved' ? '已上架' : c.status === 'pending' ? '待审批' : c.status}
                </span>
              </div>
            ))}
          </div>
        )
      )}

      {/* 学生约课 */}
      {tab === 'bookings' && (
        bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border"><p className="text-slate-400">暂无约课</p></div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => {
              const options = parseOptions(b.time_options || '[]')
              return (
                <div key={b.id} className="bg-white rounded-xl p-5 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {b.student?.username || `学生#${b.student_id}`}
                        {b.student?.phone && <span className="text-slate-400 text-sm ml-2">{b.student.phone}</span>}
                      </p>
                      <p className="text-sm text-slate-500">{b.course?.title || `课程#${b.course_id}`}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">{statusMap[b.status] || b.status}</span>
                      {b.status === 'pending' && options.length > 0 && (
                        <select
                          onChange={e => e.target.value && handlePickTime(b.id, e.target.value)}
                          className="border rounded-lg px-3 py-1.5 text-sm outline-none"
                          defaultValue=""
                        >
                          <option value="" disabled>选时间</option>
                          {options.map((t: string) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  {b.status === 'teacher_picked' && b.selected_time && (
                    <p className="text-sm text-blue-600 mt-2">已选时间：{b.selected_time}，等待学生确认</p>
                  )}
                  {b.status === 'confirmed' && b.selected_time && (
                    <p className="text-sm text-green-600 mt-2">已确认时间：{b.selected_time}</p>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}
