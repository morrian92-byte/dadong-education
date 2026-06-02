const teachers = [
  {
    id: 1, name: '王建国', title: '语文教学总监', avatar: '👨‍🏫',
    bio: '北京师范大学中文系硕士，原北京市重点中学语文教研组长。从事语文教学 15 年，主编多部语文教辅资料。擅长阅读与写作教学，课堂生动有趣，深受学生喜爱。',
    specialties: ['阅读理解', '作文指导', '古文鉴赏'],
    stats: { students: '800+', years: '15年', rate: '98%' },
  },
  {
    id: 2, name: '李雪梅', title: '数学学科带头人', avatar: '👩‍🏫',
    bio: '清华大学数学系本科，北京大学教育学硕士。10 年中考数学教学经验，深谙中考命题规律。独创"三步解题法"，帮助学生高效提分。所带班级中考数学平均分 112 分（满分 120）。',
    specialties: ['中考冲刺', '竞赛辅导', '思维训练'],
    stats: { students: '600+', years: '10年', rate: '97%' },
  },
  {
    id: 3, name: '张磊', title: '英语教学专家', avatar: '👨‍🎓',
    bio: '英国爱丁堡大学 TESOL 硕士，持有国际英语教师资格证（TESOL）。8 年英语教学经验，口语纯正流利。独创"情景沉浸式"教学法，让英语学习变得轻松有趣。',
    specialties: ['口语训练', '语法系统', '雅思托福'],
    stats: { students: '500+', years: '8年', rate: '96%' },
  },
  {
    id: 4, name: '陈晓芳', title: '物理金牌教师', avatar: '👩‍🔬',
    bio: '中国科学技术大学物理系博士，原某重点高中物理竞赛教练。教学风格严谨而不失幽默，善于用生活实例讲透物理概念。所带学生多人考入清北等顶尖高校。',
    specialties: ['高考冲刺', '竞赛培优', '实验教学'],
    stats: { students: '400+', years: '12年', rate: '99%' },
  },
  {
    id: 5, name: '刘洋', title: '化学教研组长', avatar: '👨‍🔬',
    bio: '南京大学化学系硕士，10 年中学化学教学经验。擅长将抽象的化学概念形象化，自编"化学思维导图"教学法。课堂实验丰富，激发学生对化学的探索兴趣。',
    specialties: ['中考化学', '高考化学', '实验操作'],
    stats: { students: '500+', years: '10年', rate: '95%' },
  },
  {
    id: 6, name: '周美玲', title: '小学数学名师', avatar: '👩‍🏫',
    bio: '华东师范大学小学教育专业，12 年小学数学教学经验。擅长趣味数学教学，通过游戏、故事激发孩子的数学兴趣。所带学生多次在各类数学竞赛中获奖。',
    specialties: ['奥数启蒙', '思维训练', '兴趣培养'],
    stats: { students: '700+', years: '12年', rate: '98%' },
  },
]

export default function Teachers() {
  return (
    <div>
      {/* 页面标题 */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">师资团队</h1>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            所有教师均持有教师资格证，平均教龄 8 年以上，用专业与爱心陪伴每一位学生
          </p>
        </div>
      </section>

      {/* 教师列表 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher, i) => (
              <div
                key={teacher.id}
                className="card-hover bg-white rounded-2xl overflow-hidden shadow-md animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* 头像区 */}
                <div className="bg-gradient-to-br from-primary-100 via-primary-50 to-white p-8 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-5xl">
                    {teacher.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-4">{teacher.name}</h3>
                  <p className="text-sm text-primary-600 font-medium">{teacher.title}</p>
                </div>

                {/* 信息区 */}
                <div className="p-6">
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{teacher.bio}</p>

                  {/* 擅长领域 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.specialties.map((s) => (
                      <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* 数据 */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                    {Object.entries(teacher.stats).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-slate-900">{val}</div>
                        <div className="text-xs text-slate-400">
                          {key === 'students' ? '学员' : key === 'years' ? '教龄' : '好评率'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 加入我们 */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-900" />
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">想加入大东教育？</h2>
          <p className="text-slate-200 text-lg mb-8 max-w-xl mx-auto">
            我们持续招募优秀的各学科教师，欢迎有教育梦想的你加入我们的团队
          </p>
          <a href="mailto:hr@dadongedu.com" className="btn-accent text-lg px-10 py-4 inline-block">
            投递简历
          </a>
        </div>
      </section>
    </div>
  )
}
