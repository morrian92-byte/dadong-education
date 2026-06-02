import { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const sidebarLinks = [
  { to: '/admin', label: '仪表盘', icon: '📊', end: true },
  { to: '/admin/courses', label: '课程管理', icon: '📚' },
  { to: '/admin/teachers', label: '教师管理', icon: '👨‍🏫' },
  { to: '/admin/news', label: '新闻管理', icon: '📰' },
  { to: '/admin/contacts', label: '留言管理', icon: '✉️' },
]

export default function AdminLayout() {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login', { replace: true })
    }
  }, [isLoggedIn, navigate])

  if (!isLoggedIn) return null

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-700">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              大东
            </div>
            <div>
              <span className="font-bold">大东教育</span>
              <span className="block text-xs text-slate-400">管理后台</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = link.end
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to) && link.to !== '/admin'
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors
                  ${isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-300
                       hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>🚪</span>
            <span>退出登录</span>
          </button>
          <Link
            to="/"
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-300
                       hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2 mt-1"
          >
            <span>🏠</span>
            <span>返回前台</span>
          </Link>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
