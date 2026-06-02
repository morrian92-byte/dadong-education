import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/courses', label: '课程中心' },
  { to: '/teachers', label: '师资团队' },
  { to: '/about', label: '关于我们' },
  { to: '/news', label: '新闻动态' },
  { to: '/contact', label: '联系我们' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isLoggedIn, isStudent, isTeacher, user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = () => { logout(); nav('/') }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center
                          text-white font-bold text-lg group-hover:bg-primary-800 transition-colors">
              大东
            </div>
            <div>
              <span className="text-xl font-bold text-primary-800">大东教育</span>
              <span className="hidden sm:block text-xs text-slate-500 -mt-0.5">Dadong Education</span>
            </div>
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-slate-600 hover:text-primary-700 hover:bg-primary-50/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* 右侧用户区域 */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-slate-500">
                  {isStudent && '👨‍🎓'}
                  {isTeacher && '👨‍🏫'}
                  {' '}{user?.username}
                </span>
                <button
                  onClick={() => nav(isTeacher ? '/teacher/dashboard' : '/student/dashboard')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  我的
                </button>
                <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-red-500">
                  退出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-600 hover:text-primary-700 px-3 py-2">
                  登录
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">
                  注册
                </Link>
              </>
            )}
          </div>

          {/* 移动端汉堡按钮 */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 移动端菜单 */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 animate-fade-in-up">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-2">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => { setMenuOpen(false); nav(isTeacher ? '/teacher/dashboard' : '/student/dashboard') }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm text-blue-600 hover:bg-slate-50"
                    >
                      我的
                    </button>
                    <button
                      onClick={() => { handleLogout(); setMenuOpen(false) }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-slate-50"
                    >
                      退出
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-4">
                    <Link to="/login" onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-lg text-sm border border-slate-200 text-slate-700">
                      登录
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-lg text-sm bg-blue-600 text-white">
                      注册
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
