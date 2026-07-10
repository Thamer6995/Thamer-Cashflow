import { useState } from 'react'
import { useAppData } from '../AppDataContext'
import type { CategoryType } from '../types'

function CategoryColumn({ type, title }: { type: CategoryType; title: string }) {
  const { data, addCategory, updateCategory, deleteCategory } = useAppData()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const categories = data.categories.filter((c) => c.type === type)
  const isIncome = type === 'income'

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    addCategory(name, type)
    setNewName('')
  }

  const startEdit = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      updateCategory(editingId, editingName.trim())
    }
    setEditingId(null)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex-1 min-w-[280px]">
      <h3 className={`font-bold mb-4 ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>{title}</h3>
      <ul className="space-y-2 mb-4">
        {categories.length === 0 && <li className="text-sm text-slate-400">لا توجد بنود بعد</li>}
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-2 bg-slate-50 rounded-lg px-3 py-2">
            {editingId === c.id ? (
              <input
                className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                autoFocus
              />
            ) : (
              <span className="text-sm text-slate-700">{c.name}</span>
            )}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => startEdit(c.id, c.name)}
                className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-1"
                title="تعديل"
              >
                ✏️
              </button>
              <button
                onClick={() => {
                  if (confirm(`هل تريد حذف "${c.name}"؟ سيتم حذف كل العمليات المرتبطة به.`)) deleteCategory(c.id)
                }}
                className="text-xs text-slate-400 hover:text-red-600 px-1.5 py-1"
                title="حذف"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={type === 'income' ? 'بند دخل جديد' : 'بند مصروف جديد'}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className={`text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors shrink-0 ${
            isIncome ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          إضافة
        </button>
      </form>
    </div>
  )
}

export default function CategoryManager() {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">إدارة بنود المداخيل والمصاريف</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <CategoryColumn type="income" title="بنود المداخيل" />
        <CategoryColumn type="expense" title="بنود المصاريف" />
      </div>
    </div>
  )
}
