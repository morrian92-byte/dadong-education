import { useParams, Link } from 'react-router-dom'

const newsContent: Record<number, {
  title: string; date: string; category: string; emoji: string; summary: string; content: string[]
}> = {
  1: {
    title: '2024 年暑期班课程安排及报名通知', date: '2024-06-15', category: '通知公告', emoji: '📢',
    summary: '大东教育 2024 年暑期班正式启动报名！涵盖小学到高中全学科课程，小班教学，名额有限，先到先得。',
    content: [
      '亲爱的家长朋友们：',
      '2024 年暑假即将来临，大东教育暑期班现已全面启动报名！我们为孩子们准备了丰富多样的课程，涵盖小学、初中、高中各学科的辅导与培优课程。',
      '📅 暑期班时间安排',
      '第一期：7 月 8 日 — 7 月 26 日（共 3 周，每周一至周五上课）',
      '第二期：7 月 29 日 — 8 月 16 日（共 3 周，每周一至周五上课）',
      '上课时间：上午 9:00 — 12:00 或 下午 14:00 — 17:00',
      '📚 开设课程',
      '小学部：语文阅读写作、数学思维训练、英语启蒙/提升',
      '初中部：数学培优、英语强化、物理/化学入门',
      '中考冲刺：数学、英语、物理、化学',
      '高中部：数学、物理、化学一对一/一对二',
      '💰 优惠政策',
      '早鸟优惠：6 月 25 日前报名享 9 折优惠',
      '老学员优惠：老学员续报享 8.5 折',
      '组团优惠：3 人及以上团报，每人再减 200 元',
      '📞 报名方式',
      '电话报名：400-888-9999',
      '在线报名：访问官网联系页面填写表单',
      '到校报名：北京市朝阳区建国路 88 号 SOHO 现代城 A 座 15 层',
      '名额有限，请尽早报名锁定学位！',
    ],
  },
  2: {
    title: '大东教育获评"2024年度北京市优秀教培机构"', date: '2024-05-20', category: '机构动态', emoji: '🏆',
    summary: '在刚刚结束的北京市教培行业评选中，大东教育凭借优质的教学质量和良好的家长口碑，荣获"优秀教培机构"称号。',
    content: [
      '5 月 18 日，2024 年度北京市教培行业评选颁奖典礼在北京国际会议中心隆重举行。大东教育凭借卓越的教学质量、良好的家长口碑以及持续创新的教学理念，从全市 300 余家参选机构中脱颖而出，荣获"2024 年度北京市优秀教培机构"称号。',
      '本次评选由北京市教育行业协会主办，评审团由教育专家、行业代表和家长代表共同组成。评选标准涵盖教学质量、师资水平、课程体系、家长满意度、社会影响力等多个维度。',
      '大东教育创始人兼校长在颁奖典礼上表示："这份荣誉不仅属于大东教育，更属于每一位信任我们的家长和学生。9 年来，我们始终坚守教育初心，未来也将继续用专业与爱心陪伴每一位孩子的成长。"',
      '据悉，大东教育已连续三年获得此项殊荣，这充分体现了社会各界对大东教育办学成果的认可。',
    ],
  },
  3: {
    title: '如何帮助孩子高效备战中考？名师分享 5 个关键方法', date: '2024-05-10', category: '学习方法', emoji: '📝',
    summary: '中考临近，如何科学备考？大东教育数学学科带头人李雪梅老师为家长们分享了中考备考的 5 个关键方法。',
    content: [
      '距离中考还有不到两个月的时间，很多家长和学生都进入了紧张的备考状态。如何在这最后的冲刺阶段高效复习、从容应对中考？大东教育数学学科带头人李雪梅老师结合多年的中考辅导经验，为家长们总结了 5 个关键方法。',
      '1. 制定科学的复习计划',
      '根据剩余时间和各科掌握情况，制定详细的每日复习计划。建议采用"3+2"模式：3 天集中攻克薄弱科目，2 天巩固优势科目。',
      '2. 重视真题训练',
      '历年真题是最好的复习资料。建议将近 5 年中考真题认真做 2-3 遍，重点分析错题，总结出题规律和解题思路。',
      '3. 建立错题本',
      '将平时练习和模拟考试中的错题整理成册，标注错误原因和正确解法。考前一周重点翻看错题本，避免考试时重蹈覆辙。',
      '4. 保持良好的作息',
      '考前一个月调整生物钟，保证每天 7-8 小时的充足睡眠。适当运动可以帮助缓解压力，提高学习效率。',
      '5. 家长保持平常心',
      '家长的焦虑情绪会直接影响孩子。建议家长保持平和心态，多给予孩子鼓励和支持，营造轻松的家庭氛围。',
    ],
  },
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>()
  const article = newsContent[Number(id)]

  if (!article) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center py-20">
          <span className="text-6xl">🔍</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">文章未找到</h1>
          <Link to="/news" className="btn-primary inline-block mt-6">返回新闻中心</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 文章头部 */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container-custom relative z-10">
          <Link to="/news" className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回新闻中心
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm bg-white/20 text-white px-3 py-1 rounded-full">{article.category}</span>
            <span className="text-sm text-white/70">{article.date}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{article.title}</h1>
        </div>
      </section>

      {/* 文章内容 */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <article className="prose prose-slate max-w-none">
            {article.content.map((paragraph, i) => {
              // 判断是否为标题行（以数字或emoji开头）
              const isHeading = /^[\d📅📚💰📞]/.test(paragraph) && paragraph.length < 40
              if (isHeading) {
                return <h3 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-4">{paragraph}</h3>
              }
              return <p key={i} className="text-slate-600 leading-relaxed mb-4">{paragraph}</p>
            })}
          </article>
        </div>
      </section>
    </div>
  )
}
