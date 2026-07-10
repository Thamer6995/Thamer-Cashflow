import { formatMonthLabel } from '../utils'

function shiftMonth(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split('-').map(Number)
  const d = new Date(year, month - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function MonthSelector({
  monthKey,
  onChange,
}: {
  monthKey: string
  onChange: (monthKey: string) => void
}) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-2 py-2 w-fit">
      <button
        onClick={() => onChange(shiftMonth(monthKey, -1))}
        className="text-slate-500 hover:text-slate-800 px-2 py-1 rounded text-sm font-medium"
      >
        السابق
      </button>
      <span className="font-medium text-slate-800 min-w-[110px] text-center">{formatMonthLabel(monthKey)}</span>
      <button
        onClick={() => onChange(shiftMonth(monthKey, 1))}
        className="text-slate-500 hover:text-slate-800 px-2 py-1 rounded text-sm font-medium"
      >
        التالي
      </button>
    </div>
  )
}
