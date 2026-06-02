import { Link } from 'react-router-dom'

export default function HeroBanner() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        {/* 装饰元素 */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* 内容 */}
      <div className="container-custom relative z-10 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/90 text-sm mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            2024 年暑期班火热报名中
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            点亮孩子的
            <span className="text-accent-400">未来之路</span>
            <br />
            从大东教育开始
          </h1>

          <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            专注中小学课外辅导 9 年 | 累计服务 5000+ 学员 | 98% 家长满意度
            <br />
            资深师资团队 · 个性化教学方案 · 全方位成长陪伴
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/courses" className="btn-accent text-lg px-8 py-4">
              查看课程
            </Link>
            <Link to="/contact" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-lg">
              免费试听
            </Link>
          </div>

          {/* 数据展示 */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[
              { value: '5000+', label: '累计学员' },
              { value: '98%', label: '家长满意度' },
              { value: '200+', label: '资深教师' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
