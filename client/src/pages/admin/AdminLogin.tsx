import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { authApi } from '../../utils/api'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  // 已登录则跳转
  if (isLoggedIn) {
    navigate('/admin', { replace: true })
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await authApi.login({ username, password })
      login(res.data.token)
      navigate('/admin', { replace: true })
    } catch (err: any) {
      // 如果后端不可用，使用默认账号模拟登录
      if (username === 'admin' && password === 'admin123') {
        login('demo-token-for-development')
        navigate('/admin', { replace: true })
        return
      }
      setError(err?.response?.data?.error || '登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-xl">
              大东
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">管理后台</h1>
          <p className="text-slate-300 text-sm mt-1">大东教育内容管理系统</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
          {error && (
            <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">用户名</label>
              <input
                type="text" required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                placeholder="请输入管理员用户名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">密码</label>
              <input
                type="password" required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                placeholder="请输入密码"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center"
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-4">
            演示账号：admin / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
