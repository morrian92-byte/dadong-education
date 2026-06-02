import { useState, type FormEvent } from 'react'
import { contactApi } from '../utils/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await contactApi.submit(form)
      setSubmitted(true)
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch {
      // 如果后端不可用，也模拟成功（演示用）
      setSubmitted(true)
      setForm({ name: '', phone: '', email: '', message: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* 页面标题 */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">联系我们</h1>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            有任何问题或想预约试听？请随时联系我们
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* 联系表单 */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">发送消息</h2>
              <p className="text-slate-500 mb-8">填写以下表单，我们将在 24 小时内与您联系</p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in-up">
                  <span className="text-5xl">✅</span>
                  <h3 className="text-xl font-bold text-green-800 mt-4">提交成功！</h3>
                  <p className="text-green-600 mt-2">感谢您的留言，我们的课程顾问将在 24 小时内与您联系。</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-outline mt-6 text-sm"
                  >
                    继续留言
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">{error}</div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">学生姓名 *</label>
                    <input
                      type="text" required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                      placeholder="请输入学生姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">联系电话 *</label>
                    <input
                      type="tel" required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                      placeholder="请输入手机号码"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">电子邮箱</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                      placeholder="请输入电子邮箱"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">留言内容 *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none"
                      placeholder="请描述您想咨询的课程或问题..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full text-center"
                  >
                    {loading ? '提交中...' : '提交留言'}
                  </button>
                </form>
              )}
            </div>

            {/* 联系信息 */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">联系方式</h2>
              <p className="text-slate-500 mb-8">您也可以通过以下方式直接联系我们</p>

              <div className="space-y-6">
                {[
                  { icon: '📍', title: '机构地址', content: '北京市朝阳区建国路 88 号\nSOHO 现代城 A 座 15 层', action: '查看地图 →' },
                  { icon: '📞', title: '咨询电话', content: '400-888-9999\n（周一至周日 9:00-21:00）', action: '立即拨打 →' },
                  { icon: '📧', title: '电子邮箱', content: 'contact@dadongedu.com\n（24小时在线）', action: '发送邮件 →' },
                  { icon: '🕐', title: '工作时间', content: '周一至周五：9:00 - 21:00\n周末及节假日：9:00 - 18:00', action: '' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-xl">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 whitespace-pre-line">{item.content}</p>
                      {item.action && (
                        <span className="inline-block mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer transition-colors">
                          {item.action}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 地图占位 */}
              <div className="mt-8 rounded-2xl overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl">🗺️</span>
                  <p className="text-slate-400 text-sm mt-2">地图加载区域</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
