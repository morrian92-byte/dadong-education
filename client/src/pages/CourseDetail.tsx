import { useParams, Link } from 'react-router-dom'

const courseData: Record<number, {
  title: string; category: string; grades: string; price: string; emoji: string
  color: string; desc: string; outline: string[]; highlights: string[]
}> = {
  1: {
    title: '小学语文阅读写作班', category: '小学辅导', grades: '1-6年级', price: '¥2,980/期',
    emoji: '📖', color: 'from-blue-500 to-blue-600',
    desc: '培养阅读兴趣，提升写作能力，打牢语文基础。通过经典篇目赏析、写作技巧训练、阅读方法指导，全面提升语文素养。采用"以读促写、读写结合"的教学模式，让孩子爱上语文、学好语文。',
    outline: ['基础阅读方法指导（精读、泛读、跳读）', '经典篇目赏析与阅读理解训练', '写作基本功训练（词语运用、句式变换）', '记叙文/说明文/议论文写作技巧', '考场作文快速构思与高分策略', '每阶段一次综合测评，查漏补缺'],
    highlights: ['8人小班教学，关注每位学生', '自主研发教材，贴合新课标', '每周阅读打卡，培养阅读习惯', '定期家长沟通，反馈学习进展'],
  },
  2: {
    title: '小学数学思维训练', category: '小学辅导', grades: '3-6年级', price: '¥2,680/期',
    emoji: '🧮', color: 'from-cyan-500 to-cyan-600',
    desc: '培养逻辑思维能力，掌握高效解题方法，告别死记硬背。通过趣味数学游戏、实际应用场景、竞赛题型训练，建立系统的数学知识体系。',
    outline: ['数学思维入门：分类与归纳', '应用题解题策略与方法', '几何图形的认识与空间想象', '奥数入门与竞赛思维训练', '速算技巧与计算方法优化', '综合训练与阶段测评'],
    highlights: ['8人小班教学，关注每位学生', '趣味教学法，激发数学兴趣', '竞赛级教师授课', '定期家长沟通，反馈学习进展'],
  },
  4: {
    title: '初中数学培优班', category: '初中辅导', grades: '7-9年级', price: '¥3,280/期',
    emoji: '📐', color: 'from-green-500 to-green-600',
    desc: '系统梳理知识体系，攻克重难点题型，提升解题速度与准确率。涵盖代数、几何、函数、概率等初中数学核心模块，冲刺年级前列。',
    outline: ['代数基础夯实：方程与不等式', '几何证明与计算专题', '函数概念与图像分析', '概率统计与数据处理', '中考压轴题专项突破', '模拟测试与考前冲刺'],
    highlights: ['8人小班教学，关注每位学生', '中考命题研究专家授课', '每周专项练习题', '定期家长沟通，反馈学习进展'],
  },
  8: {
    title: '高中物理一对一', category: '高中辅导', grades: '10-12年级', price: '¥800/课时',
    emoji: '⚡', color: 'from-orange-500 to-orange-600',
    desc: '名师一对一精准辅导，从力学到电磁学，定制专属学习计划。针对学生的薄弱环节进行专项突破，高效提升物理成绩。',
    outline: ['入学诊断，定制学习方案', '力学专题：运动学、动力学、能量守恒', '电磁学专题：静电场、恒定电流、磁场', '热学与近代物理基础', '实验题专项训练', '高考真题精讲与模拟'],
    highlights: ['一对一专属教师', '灵活排课，时间自由', '每节课后学习报告', '高考命题趋势分析'],
  },
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const course = courseData[Number(id)]

  if (!course) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center py-20">
          <span className="text-6xl">🔍</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">课程未找到</h1>
          <p className="text-slate-500 mt-2">请检查课程链接是否正确</p>
          <Link to="/courses" className="btn-primary inline-block mt-6">返回课程中心</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 课程头部 */}
      <section className={`relative py-16 md:py-20 bg-gradient-to-br ${course.color}`}>
        <div className="container-custom relative z-10">
          <Link to="/courses" className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回课程中心
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-6xl">{course.emoji}</span>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm bg-white/20 text-white px-3 py-1 rounded-full">{course.category}</span>
                <span className="text-sm text-white/80">{course.grades}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{course.title}</h1>
              <p className="mt-4 text-white/80 max-w-2xl">{course.desc}</p>
              <div className="mt-6 flex items-center gap-4">
                <span className="text-3xl font-bold text-white">{course.price}</span>
                <Link to="/contact" className="btn-accent">立即报名</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 课程详情 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* 课程大纲 */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">📋 课程大纲</h2>
              <div className="space-y-4">
                {course.outline.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-slate-700 py-1">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 课程亮点 */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-4">✨ 课程亮点</h2>
                <ul className="space-y-3">
                  {course.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-primary w-full text-center mt-8 block">
                  预约试听课程
                </Link>
                <p className="text-xs text-slate-400 text-center mt-3">
                  试听不满意，全额退款
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
