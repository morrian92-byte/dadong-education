import { useEffect, useState } from 'react'
import { dashboardApi } from '../../utils/api'

interface Stats {
  courses: number
  teachers: number
  news: number
  contacts: number
}

const statCards = [
  { key: 'courses', label: '课程总数', icon: '📚', color: 'bg-blue-50 text-blue-600' },
  { key: 'teachers', label: '教师总数', icon: '👨‍🏫', color: 'bg-green-50 text-green-600' },
  { key: 'news', label: '新闻动态', icon: '📰', color: 'bg-purple-50 text-purple-600' },
  { key: 'contacts', label: '咨询留言', icon: '✉️', color: 'bg-orange-50 text-orange-600' },
]

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ courses: 0, teachers: 0, news: 0, contacts: 0 })

  useEffect(() => {
    dashboardApi.getStats()
      .then(res => setStats(res.data))
      .catch(() => {
        // 后端不可用时显示演示数据
        setStats({ courses: 9, teachers: 6, news: 6, contacts: 0 })
      })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">仪表盘</h1>
      <p className="text-slate-500 mb-8">欢迎回来，以下是系统数据概览</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.color}`}>
                {card.icon}
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {stats[card.key as keyof Stats]}
            </div>
            <div className="text-sm text-slate-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: '添加课程', to: '/admin/courses', icon: '➕' },
            { label: '添加教师', to: '/admin/teachers', icon: '👤' },
            { label: '发布新闻', to: '/admin/news', icon: '📝' },
          ].map((action) => (
            <a
              key={action.label}
              href={action.to}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100
                         hover:border-primary-200 hover:shadow-md transition-all"
            >
              <span className="text-xl">{action.icon}</span>
              <span className="font-medium text-slate-700">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
