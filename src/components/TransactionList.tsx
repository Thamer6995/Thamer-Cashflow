import { useMemo, useState } from 'react'
import { useAppData, monthKeyOf } from '../AppDataContext'
import type { Transaction } from '../types'
import { formatCurrency } from '../utils'
import TransactionForm from './TransactionForm'

export default function TransactionList({ monthKey }: { monthKey: string }) {
  const { data, deleteTransaction } = useAppData()
  const [editing, setEditing] = useState<Transaction | null>(null)

  const transactions = useMemo(
    () =>
      data.transactions
        .filter((t) => monthKeyOf(t.date) === monthKey)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [data.transactions, monthKey],
  )

  const catById = useMemo(() => new Map(data.categories.map((c) => [c.id, c])), [data.categories])

  if (editing) {
    return <TransactionForm editingTransaction={editing} onDoneEditing={() => setEditing(null)} />
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-800">عمليات الشهر ({transactions.length})</h3>
      </div>
      {transactions.length === 0 ? (
        <p className="text-sm text-slate-400 px-5 py-8 text-center">لا توجد عمليات مسجلة لهذا الشهر بعد</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs border-b border-slate-100">
                <th className="text-right font-medium px-5 py-2">التاريخ</th>
                <th className="text-right font-medium px-5 py-2">البند</th>
                <th className="text-right font-medium px-5 py-2">ملاحظة</th>
                <th className="text-left font-medium px-5 py-2">المبلغ</th>
                <th className="px-5 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const cat = catById.get(t.categoryId)
                return (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{t.date}</td>
                    <td className="px-5 py-3 text-slate-700">{cat?.name ?? 'بند محذوف'}</td>
                    <td className="px-5 py-3 text-slate-400">{t.note ?? '—'}</td>
                    <td
                      className={`px-5 py-3 text-left font-medium whitespace-nowrap ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => setEditing(t)}
                          className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-1"
                          title="تعديل"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('هل تريد حذف هذه العملية؟')) deleteTransaction(t.id)
                          }}
                          className="text-xs text-slate-400 hover:text-red-600 px-1.5 py-1"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
