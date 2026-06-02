import { Link } from 'react-router-dom'

const popularCourses = [
  {
    id: 1,
    title: '小学语文阅读写作班',
    category: '小学辅导',
    grades: '1-6 年级',
    desc: '培养阅读兴趣，提升写作能力，打牢语文基础。',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    title: '初中数学培优班',
    category: '初中辅导',
    grades: '7-9 年级',
    desc: '系统梳理知识体系，攻克重难点，冲刺高分。',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 3,
    title: '中考英语冲刺班',
    category: '中考冲刺',
    grades: '9 年级',
    desc: '真题精讲 + 模拟训练，全面突破英语瓶颈。',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 4,
    title: '高中物理一对一',
    category: '高中辅导',
    grades: '10-12 年级',
    desc: '名师一对一精准辅导，高效提升物理成绩。',
    color: 'from-orange-500 to-orange-600',
  },
]

export default function PopularCourses() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">热门推荐</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">精选课程</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            涵盖小学到高中的全学科辅导课程，满足不同阶段学生的学习需求
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-accent-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCourses.map((course, i) => (
            <div
              key={course.id}
              className="card-hover bg-white rounded-2xl overflow-hidden shadow-md animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* 渐变色块 */}
              <div className={`h-36 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                <span className="text-4xl opacity-80">
                  {['📖', '📐', '🌍', '⚡'][i]}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs text-slate-400">{course.grades}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{course.desc}</p>
                <Link
                  to={`/courses/${course.id}`}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1"
                >
                  了解详情
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/courses" className="btn-outline">
            查看全部课程
          </Link>
        </div>
      </div>
    </section>
  )
}
