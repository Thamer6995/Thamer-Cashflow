import { useMemo, useState } from 'react'
import { useAppData } from '../AppDataContext'
import type { CategoryType, Transaction } from '../types'
import { todayStr } from '../utils'

interface Props {
  editingTransaction?: Transaction | null
  onDoneEditing?: () => void
}

export default function TransactionForm({ editingTransaction, onDoneEditing }: Props) {
  const { data, addTransaction, updateTransaction } = useAppData()

  const [type, setType] = useState<CategoryType>(editingTransaction?.type ?? 'income')
  const [date, setDate] = useState(editingTransaction?.date ?? todayStr())
  const [categoryId, setCategoryId] = useState(editingTransaction?.categoryId ?? '')
  const [amount, setAmount] = useState(editingTransaction ? String(editingTransaction.amount) : '')
  const [note, setNote] = useState(editingTransaction?.note ?? '')
  const [error, setError] = useState('')

  const categories = useMemo(() => data.categories.filter((c) => c.type === type), [data.categories, type])

  const isEditing = !!editingTransaction

  const resetForm = () => {
    setType('income')
    setDate(todayStr())
    setCategoryId('')
    setAmount('')
    setNote('')
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(amount)
    if (!categoryId) {
      setError('اختر البند')
      return
    }
    if (amount.trim() === '' || Number.isNaN(value) || value <= 0) {
      setError('أدخل مبلغًا صحيحًا أكبر من صفر')
      return
    }
    const payload = { date, categoryId, type, amount: value, note: note.trim() || undefined }
    if (isEditing && editingTransaction) {
      updateTransaction(editingTransaction.id, payload)
      onDoneEditing?.()
    } else {
      addTransaction(payload)
      resetForm()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <h3 className="font-bold text-slate-800">{isEditing ? 'تعديل العملية' : 'تسجيل عملية جديدة'}</h3>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setType('income')
            setCategoryId('')
          }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium border transition-colors ${
            type === 'income'
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}
        >
          دخل
        </button>
        <button
          type="button"
          onClick={() => {
            setType('expense')
            setCategoryId('')
          }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium border transition-colors ${
            type === 'expense'
              ? 'bg-rose-600 border-rose-600 text-white'
              : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}
        >
          مصروف
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">التاريخ</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">المبلغ</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">البند</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">اختر البند</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="text-xs text-amber-600 mt-1">لا توجد بنود لهذا النوع، أضِف بندًا من تبويب البنود أولًا.</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">ملاحظة (اختياري)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg py-2.5 transition-colors"
        >
          {isEditing ? 'حفظ التعديل' : 'إضافة العملية'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onDoneEditing}
            className="rounded-lg py-2.5 px-4 border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  )
}
