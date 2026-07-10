import { formatCurrency } from '../utils'
import type { MonthSummary } from '../types'

function StatTile({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'neutral' | 'positive' | 'negative' | 'balance'
}) {
  const toneClasses: Record<string, string> = {
    neutral: 'text-slate-800',
    positive: 'text-emerald-600',
    negative: 'text-rose-600',
    balance: value >= 0 ? 'text-emerald-600' : 'text-rose-600',
  }
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <p className="text-xs font-medium text-slate-500 mb-2">{label}</p>
      <p className={`text-xl font-bold ${toneClasses[tone]}`}>{formatCurrency(value)}</p>
    </div>
  )
}

function BreakdownList({
  title,
  items,
  total,
  barColor,
}: {
  title: string
  items: { category: { id: string; name: string }; total: number }[]
  total: number
  barColor: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="font-bold text-slate-800 mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">لا توجد عمليات لهذا الشهر</p>
      ) : (
        <ul className="space-y-3">
          {items.map(({ category, total: catTotal }) => {
            const pct = total > 0 ? Math.round((catTotal / total) * 100) : 0
            return (
              <li key={category.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{category.name}</span>
                  <span className="text-slate-600 font-medium">{formatCurrency(catTotal)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function MonthlySummary({ summary }: { summary: MonthSummary }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="الرصيد الافتتاحي" value={summary.openingBalance} tone="neutral" />
        <StatTile label="إجمالي المداخيل" value={summary.totalIncome} tone="positive" />
        <StatTile label="إجمالي المصاريف" value={summary.totalExpense} tone="negative" />
        <StatTile label="الرصيد الختامي" value={summary.closingBalance} tone="balance" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <BreakdownList
          title="المداخيل حسب البند"
          items={summary.incomeByCategory}
          total={summary.totalIncome}
          barColor="bg-emerald-500"
        />
        <BreakdownList
          title="المصاريف حسب البند"
          items={summary.expenseByCategory}
          total={summary.totalExpense}
          barColor="bg-rose-500"
        />
      </div>
    </div>
  )
}
