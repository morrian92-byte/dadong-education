import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/ui/SectionTitle'

const allCourses = [
  {
    id: 1, title: '小学语文阅读写作班', category: '小学辅导', grades: '1-6年级',
    desc: '培养阅读兴趣，提升写作能力，打牢语文基础。通过经典篇目赏析、写作技巧训练、阅读方法指导，全面提升语文素养。',
    price: '¥2,980/期', color: 'from-blue-500 to-blue-600', emoji: '📖',
  },
  {
    id: 2, title: '小学数学思维训练', category: '小学辅导', grades: '3-6年级',
    desc: '培养逻辑思维能力，掌握高效解题方法，告别死记硬背，建立数学知识体系。',
    price: '¥2,680/期', color: 'from-cyan-500 to-cyan-600', emoji: '🧮',
  },
  {
    id: 3, title: '小学英语启蒙班', category: '小学辅导', grades: '1-3年级',
    desc: '趣味英语启蒙，自然拼读 + 绘本阅读，培养英语学习兴趣，建立语感基础。',
    price: '¥2,580/期', color: 'from-pink-500 to-pink-600', emoji: '🔤',
  },
  {
    id: 4, title: '初中数学培优班', category: '初中辅导', grades: '7-9年级',
    desc: '系统梳理知识体系，攻克重难点题型，提升解题速度与准确率，冲刺年级前列。',
    price: '¥3,280/期', color: 'from-green-500 to-green-600', emoji: '📐',
  },
  {
    id: 5, title: '初中英语强化班', category: '初中辅导', grades: '7-9年级',
    desc: '语法系统讲解 + 真题训练，全面提升听说读写能力，夯实中考英语基础。',
    price: '¥3,280/期', color: 'from-teal-500 to-teal-600', emoji: '🌍',
  },
  {
    id: 6, title: '中考数学冲刺班', category: '中考冲刺', grades: '9年级',
    desc: '近 5 年中考真题精讲，压轴题专项突破，模拟考试 + 精准估分，助力中考高分。',
    price: '¥4,980/期', color: 'from-red-500 to-red-600', emoji: '🎯',
  },
  {
    id: 7, title: '中考英语冲刺班', category: '中考冲刺', grades: '9年级',
    desc: '真题精讲 + 模拟训练，听力/阅读/写作/语法全面突破，考前押题精准命中。',
    price: '¥4,680/期', color: 'from-purple-500 to-purple-600', emoji: '📝',
  },
  {
    id: 8, title: '高中物理一对一', category: '高中辅导', grades: '10-12年级',
    desc: '名师一对一精准辅导，从力学到电磁学，定制专属学习计划，高效提分。',
    price: '¥800/课时', color: 'from-orange-500 to-orange-600', emoji: '⚡',
  },
  {
    id: 9, title: '高中数学一对一', category: '高中辅导', grades: '10-12年级',
    desc: '函数/几何/概率/导数全面覆盖，查漏补缺 + 培优拓展，稳步提升数学成绩。',
    price: '¥800/课时', color: 'from-indigo-500 to-indigo-600', emoji: '📊',
  },
]

const categories = ['全部', '小学辅导', '初中辅导', '中考冲刺', '高中辅导']

export default function Courses() {
  const [activeCategory, setActiveCategory] = useState('全部')

  const filtered = activeCategory === '全部'
    ? allCourses
    : allCourses.filter(c => c.category === activeCategory)

  return (
    <div>
      {/* 页面标题 */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">课程中心</h1>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            涵盖小学到高中的全学科辅导课程，找到最适合孩子的学习方案
          </p>
        </div>
      </section>

      {/* 筛选 + 课程列表 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {/* 分类筛选 */}
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

          {/* 课程网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <div
                key={course.id}
                className="card-hover bg-white rounded-2xl overflow-hidden shadow-md animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`h-40 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                  <span className="text-5xl opacity-90">{course.emoji}</span>
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
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-lg font-bold text-primary-700">{course.price}</span>
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      了解详情 →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
