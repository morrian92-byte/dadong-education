const timeline = [
  { year: '2015', title: '梦想起航', desc: '大东教育在北京正式成立，首期开设 3 个教学班，招收 45 名学员。' },
  { year: '2017', title: '快速发展', desc: '学员突破 500 人，新增初中数学、英语辅导课程，教师团队扩充至 30 人。' },
  { year: '2019', title: '品牌升级', desc: '完成品牌升级，课程体系覆盖小学到高中全学科。获"北京市优秀教培机构"称号。' },
  { year: '2021', title: '线上拓展', desc: '推出在线直播课程，线上线下融合教学模式。累计服务学员突破 3000 人。' },
  { year: '2023', title: '持续创新', desc: '自主研发智能学习系统，推出 AI 辅助教学。新开 2 个分校，教师团队超 200 人。' },
  { year: '2024', title: '砥砺前行', desc: '累计服务学员突破 5000 人，家长满意度保持 98% 以上。继续用专业与爱陪伴每一位学子。' },
]

const values = [
  { icon: '🎯', title: '使命', desc: '让每个孩子都能享受到优质、个性化的教育服务，发现并成就更好的自己。' },
  { icon: '🔭', title: '愿景', desc: '成为最受信赖的中小学课外辅导品牌，推动教育公平与质量提升。' },
  { icon: '💎', title: '价值观', desc: '以学生为中心，以质量求生存，以创新促发展，以诚信立根基。' },
]

export default function About() {
  return (
    <div>
      {/* 页面标题 */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">关于我们</h1>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            了解大东教育的故事、理念与使命
          </p>
        </div>
      </section>

      {/* 机构简介 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">About Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">大东教育的故事</h2>
              <div className="mt-6 h-1 w-16 rounded-full bg-accent-500" />
              <p className="mt-6 text-slate-500 leading-relaxed text-lg">
                大东教育成立于 2015 年，由一群怀揣教育梦想的资深教师共同创办。我们坚信每个孩子都有独特的潜能，而好的教育就是帮助孩子发现并释放这些潜能。
              </p>
              <p className="mt-4 text-slate-500 leading-relaxed">
                经过 9 年的发展，大东教育已从最初的小型补习班，成长为拥有 200+ 教师团队、服务 5000+ 学员的专业教培机构。我们始终秉持「因材施教，立德树人」的办学理念，将教学质量视为生命线。
              </p>
              <p className="mt-4 text-slate-500 leading-relaxed">
                未来，大东教育将继续深耕中小学课外辅导领域，不断优化课程体系，提升教学质量，用心陪伴每一位学子的成长之路。
              </p>
            </div>

            {/* 形象图 */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-accent-100 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-9xl">🏫</span>
                  <p className="mt-4 text-slate-500 font-medium">大东教育总部校区</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 使命愿景价值观 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">使命 · 愿景 · 价值观</h2>
            <div className="mt-6 h-1 w-16 rounded-full bg-accent-500 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="card-hover bg-white rounded-2xl p-8 text-center shadow-md animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">发展历程</h2>
            <p className="mt-3 text-slate-500">一路走来，每一步都踏实有力</p>
            <div className="mt-6 h-1 w-16 rounded-full bg-accent-500 mx-auto" />
          </div>

          <div className="relative">
            {/* 竖线 */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-100 -translate-x-1/2" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={`relative flex items-start gap-6 md:gap-10 animate-fade-in-up
                    ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* 圆点 */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary-600 border-4 border-white shadow -translate-x-1/2 mt-1.5 z-10" />

                  {/* 内容 */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="inline-block text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>

                  {/* 对面占位 */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
