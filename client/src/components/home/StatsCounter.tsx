export default function StatsCounter() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-900" />
      <div className="absolute inset-0 bg-white/5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='dots' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23dots)'/%3E%3C/svg%3E")`,
      }} />

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">大东教育 · 用数据说话</h2>
          <p className="mt-3 text-slate-300">9 年深耕，每一步都扎实有力</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '5000+', label: '累计学员', icon: '👨‍🎓' },
            { value: '200+', label: '资深教师', icon: '👩‍🏫' },
            { value: '300+', label: '精品课程', icon: '📚' },
            { value: '9 年', label: '办学经验', icon: '🏫' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
