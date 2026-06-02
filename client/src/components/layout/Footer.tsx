import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* 主体 */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 机构简介 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                大东
              </div>
              <span className="text-white font-bold text-lg">大东教育</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              大东教育成立于 2015 年，专注中小学课外辅导与素质教育。
              秉承「因材施教，立德树人」的办学理念，已累计服务超过 5000 名学员。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-white font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/courses', label: '课程中心' },
                { to: '/teachers', label: '师资团队' },
                { to: '/about', label: '关于我们' },
                { to: '/news', label: '新闻动态' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 课程分类 */}
          <div>
            <h4 className="text-white font-semibold mb-4">课程分类</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">小学同步辅导</li>
              <li className="hover:text-white transition-colors cursor-pointer">初中培优提升</li>
              <li className="hover:text-white transition-colors cursor-pointer">中考冲刺班</li>
              <li className="hover:text-white transition-colors cursor-pointer">高中一对一</li>
              <li className="hover:text-white transition-colors cursor-pointer">艺考文化课</li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="text-white font-semibold mb-4">联系我们</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>北京市朝阳区建国路 88 号 SOHO 现代城 A 座 15 层</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>400-888-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@dadongedu.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <div className="border-t border-slate-800">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} 大东教育 Dadong Education. All rights reserved.</p>
          <p>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">ICP 备案号：京 ICP 备 2024XXXXXX 号</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
