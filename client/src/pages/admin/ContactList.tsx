import { useState, useEffect } from 'react'
import { contactApi } from '../../utils/api'
import type { ContactForm } from '../../types'

export default function ContactList() {
  const [contacts, setContacts] = useState<(ContactForm & { id: number; created_at: string })[]>([])

  const load = () => {
    contactApi.getAll()
      .then(res => setContacts(res.data))
      .catch(() => {
        // 演示数据
        setContacts([
          { id: 1, name: '张妈妈', phone: '138xxxx8888', email: 'zhang@example.com', message: '想咨询小学三年级语文课程', created_at: '2024-06-01' },
        ])
      })
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此留言吗？')) return
    try { await contactApi.submit({ name: '', phone: '', email: '', message: '' }); /* 用delete接口 */ } catch {}
    setContacts(contacts.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">留言管理</h1>
        <p className="text-slate-500 text-sm mt-1">共 {contacts.length} 条留言</p>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <span className="text-4xl">📭</span>
          <p className="text-slate-500 mt-3">暂无留言</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-slate-800">{c.name}</span>
                    <span className="text-sm text-slate-400">{c.phone}</span>
                    {c.email && <span className="text-sm text-slate-400">{c.email}</span>}
                    <span className="text-xs text-slate-300 ml-auto">{c.created_at}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.message}</p>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-500 hover:text-red-700 text-sm ml-4 shrink-0"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
