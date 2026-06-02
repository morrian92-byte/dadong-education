import { Link } from 'react-router-dom'

const newsArticles = [
  {
    id: 1, title: '2024 年暑期班课程安排及报名通知', date: '2024-06-15',
    summary: '大东教育 2024 年暑期班正式启动报名！涵盖小学到高中全学科课程，小班教学，名额有限，先到先得。',
    category: '通知公告', emoji: '📢',
  },
  {
    id: 2, title: '大东教育获评"2024年度北京市优秀教培机构"', date: '2024-05-20',
    summary: '在刚刚结束的北京市教培行业评选中，大东教育凭借优质的教学质量和良好的家长口碑，荣获"优秀教培机构"称号。',
    category: '机构动态', emoji: '🏆',
  },
  {
    id: 3, title: '如何帮助孩子高效备战中考？名师分享 5 个关键方法', date: '2024-05-10',
    summary: '中考临近，如何科学备考？大东教育数学学科带头人李雪梅老师为家长们分享了中考备考的 5 个关键方法。',
    category: '学习方法', emoji: '📝',
  },
  {
    id: 4, title: '大东教育第三届"名师杯"教学技能大赛圆满落幕', date: '2024-04-28',
    summary: '4 月 25 日，大东教育第三届"名师杯"教学技能大赛在总部校区成功举办，来自各分校的 30 位优秀教师同台竞技。',
    category: '机构动态', emoji: '🎉',
  },
  {
    id: 5, title: '小学阶段如何培养孩子的阅读习惯？', date: '2024-04-15',
    summary: '阅读是语文学习的基石，也是终身学习的基础。大东教育语文教学总监王建国老师分享培养小学生阅读习惯的实用建议。',
    category: '学习方法', emoji: '📖',
  },
  {
    id: 6, title: '大东教育公益助学计划启动，助力 100 名贫困学子', date: '2024-03-22',
    summary: '大东教育宣布启动"星光计划"公益助学项目，将为 100 名家庭困难的学生提供免费课外辅导课程。',
    category: '社会责任', emoji: '💝',
  },
  {
    id: 7, title: '新学期开学季：这些学习习惯你家孩子养成了吗？', date: '2024-03-01',
    summary: '新学期伊始，正是培养良好学习习惯的黄金时期。大东教育整理了新学期必须养成的 7 个好习惯，供家长们参考。',
    category: '学习方法', emoji: '✏️',
  },
  {
    id: 8, title: '大东教育朝阳第二分校正式开业', date: '2024-02-18',
    summary: '2 月 16 日，大东教育朝阳第二分校举行隆重的开业典礼，新校区面积达 1200 平方米，配备 15 间标准教室。',
    category: '机构动态', emoji: '🎊',
  },
]

const categories = ['全部', '通知公告', '机构动态', '学习方法', '社会责任']

export default function News() {
  return (
    <div>
      {/* 页面标题 */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">新闻动态</h1>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            了解大东教育最新资讯、教育干货与机构动态
          </p>
        </div>
      </section>

      {/* 新闻列表 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl">
          <div className="space-y-6">
            {newsArticles.map((article, i) => (
              <Link
                key={article.id}
                to={`/news/${article.id}`}
                className="block card-hover bg-white rounded-2xl p-6 md:p-8 shadow-md animate-fade-in-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="text-4xl shrink-0 hidden sm:block">{article.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-400">{article.date}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2 hover:text-primary-700 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">{article.summary}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// 导出 categories 供 Admin 使用
export { categories }
