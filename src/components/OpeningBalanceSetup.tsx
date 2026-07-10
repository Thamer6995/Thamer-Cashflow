import { useState } from 'react'
import { useAppData } from '../AppDataContext'
import { todayStr } from '../utils'

export default function OpeningBalanceSetup() {
  const { setOpeningBalance } = useAppData()
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayStr())
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(amount)
    if (amount.trim() === '' || Number.isNaN(value)) {
      setError('الرجاء إدخال رصيد صحيح')
      return
    }
    setOpeningBalance(value, date)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-xl font-bold text-slate-800 mb-1">مرحبًا بك في متابعة التدفقات النقدية</h1>
        <p className="text-slate-500 mb-6 text-sm">
          قبل البدء، أدخل رصيد النقد الافتتاحي وتاريخه ليكون أساس حساب رصيدك الشهري.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الرصيد النقدي الافتتاحي</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">تاريخ الرصيد الافتتاحي</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg py-2.5 transition-colors"
          >
            بدء المتابعة
          </button>
        </form>
      </div>
    </div>
  )
}
