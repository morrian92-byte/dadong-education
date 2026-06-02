import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/ui/SectionTitle'
import { coursesApi } from '../utils/api'
import type { Course } from '../types'

const categoryColors: Record<string, string> = {
  '小学辅导': 'from-blue-500 to-blue-600',
  '初中辅导': 'from-green-500 to-green-600',
  '中考冲刺': 'from-red-500 to-red-600',
  '高中辅导': 'from-orange-500 to-orange-600',
}

const categoryEmojis: Record<string, string> = {
  '小学辅导': '📖', '初中辅导': '📐', '中考冲刺': '🎯', '高中辅导': '⚡',
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [activeCategory, setActiveCategory] = useState('全部')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    coursesApi.getAll()
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // 从数据中提取不重复的分类
  const categories = ['全部', ...new Set(courses.map(c => c.category).filter(Boolean))]

  const filtered = activeCategory === '全部'
    ? courses
    : courses.filter(c => c.category === activeCategory)

  // 如果 API 没数据，显示演示课程
  const displayCourses = courses.length > 0 ? filtered : []

  return (
    <div>
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">课程中心</h1>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            涵盖小学到高中的全学科辅导课程，找到最适合孩子的学习方案
          </p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${activeCategory === cat
                      ? 'bg-primary-700 text-white shadow-lg shadow-primary-200'
                      : 'bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-700 border border-slate-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-center text-slate-400 py-12">加载中...</p>
          ) : displayCourses.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl">📚</span>
              <p className="text-slate-500 mt-3">暂无课程，敬请期待</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCourses.map((course, i) => {
                const color = categoryColors[course.category] || 'from-slate-500 to-slate-600'
                const emoji = categoryEmojis[course.category] || '📚'
                return (
                  <div
                    key={course.id}
                    className="card-hover bg-white rounded-2xl overflow-hidden shadow-md"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className={`h-40 bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <span className="text-5xl opacity-90">{emoji}</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                          {course.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-lg font-bold text-primary-700">{course.price || '详询'}</span>
                        <Link
                          to={`/courses/${course.id}`}
                          className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          了解详情 →
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
