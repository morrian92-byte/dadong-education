import { Link } from 'react-router-dom'
import HeroBanner from '../components/home/HeroBanner'
import FeatureCards from '../components/home/FeatureCards'
import PopularCourses from '../components/home/PopularCourses'
import StatsCounter from '../components/home/StatsCounter'

const testimonials = [
  {
    name: '李妈妈',
    role: '小学六年级家长',
    text: '孩子在大东教育学了两年，语文成绩从 70 分提升到稳定 90 分以上。老师们非常有耐心，孩子现在特别爱看书了！',
    avatar: '👩',
  },
  {
    name: '张爸爸',
    role: '初三学生家长',
    text: '中考冲刺班效果太好了！孩子数学从班级中游考到了年级前十，顺利考上了重点高中。真心感谢大东教育的老师们！',
    avatar: '👨',
  },
  {
    name: '王同学',
    role: '高二学生',
    text: '高中物理一直是我的弱项，在大东一对一辅导了半年，不仅成绩提升了，更重要的是找到了学习物理的方法和信心。',
    avatar: '🧑',
  },
]

export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeatureCards />
      <PopularCourses />

      {/* 为什么选择我们 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">Why Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">为什么选择大东教育？</h2>
              <div className="mt-6 h-1 w-16 rounded-full bg-accent-500" />
              <p className="mt-6 text-slate-500 leading-relaxed text-lg">
                大东教育自 2015 年成立以来，始终秉持「因材施教，立德树人」的办学理念，致力于为每一位学生提供最优质的教育服务。
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { title: '名师领航', desc: '所有教师均来自 985/211 重点院校，平均教龄 8 年以上' },
                  { title: '科学体系', desc: '自主研发课程体系，紧跟最新考试大纲，精准把握考点' },
                  { title: '全程跟踪', desc: '入学测评 → 方案制定 → 阶段测试 → 定期反馈，全程陪伴成长' },
                  { title: '舒适环境', desc: '现代化教学设施，小班教室宽敞明亮，学习氛围浓厚' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="w-6 h-6 mt-0.5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <div>
                      <h4 className="font-semibold text-slate-800">{item.title}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/about" className="btn-primary inline-block mt-8">
                了解更多
              </Link>
            </div>

            {/* 图片占位 */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-accent-100 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl">🎓</span>
                  <p className="mt-4 text-slate-500 font-medium">大东教育教学环境</p>
                </div>
              </div>
              {/* 浮动卡片 */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 md:p-6 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">⭐</div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">4.9</div>
                    <div className="text-sm text-slate-500">家长综合评分</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsCounter />

      {/* 家长好评 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">家长好评如潮</h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto">来自真实家长的反馈，是我们不断前行的最大动力</p>
            <div className="mt-6 h-1 w-16 rounded-full bg-accent-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 md:p-8 card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-1 mb-4 text-accent-500">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-900" />
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">准备好开启孩子的成长之旅了吗？</h2>
          <p className="text-slate-200 text-lg mb-8 max-w-xl mx-auto">
            现在预约即可获得免费试听课一节，让专业老师为您的孩子量身定制学习方案
          </p>
          <Link to="/contact" className="btn-accent text-lg px-10 py-4 inline-block">
            立即预约试听
          </Link>
        </div>
      </section>
    </>
  )
}
