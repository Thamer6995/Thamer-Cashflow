import { useState } from 'react'
import { AppDataProvider, useAppData } from './AppDataContext'
import OpeningBalanceSetup from './components/OpeningBalanceSetup'
import MonthSelector from './components/MonthSelector'
import MonthlySummary from './components/MonthlySummary'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import CategoryManager from './components/CategoryManager'
import { currentMonthKey } from './utils'

type Tab = 'summary' | 'transactions' | 'categories'

function MainApp() {
  const [monthKey, setMonthKey] = useState(currentMonthKey())
  const [tab, setTab] = useState<Tab>('summary')
  const { getMonthSummary } = useAppData()
  const summary = getMonthSummary(monthKey)

  const tabs: { key: Tab; label: string }[] = [
    { key: 'summary', label: 'الملخص الشهري' },
    { key: 'transactions', label: 'العمليات اليومية' },
    { key: 'categories', label: 'البنود' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-lg font-bold text-slate-800">متابعة التدفقات النقدية الشهرية</h1>
          {tab !== 'categories' && <MonthSelector monthKey={monthKey} onChange={setMonthKey} />}
        </div>
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'summary' && <MonthlySummary summary={summary} />}
        {tab === 'transactions' && (
          <div className="grid md:grid-cols-[380px_1fr] gap-4 items-start">
            <TransactionForm />
            <TransactionList monthKey={monthKey} />
          </div>
        )}
        {tab === 'categories' && <CategoryManager />}
      </main>
    </div>
  )
}

function Gate() {
  const { data } = useAppData()
  if (data.openingBalance === null) return <OpeningBalanceSetup />
  return <MainApp />
}

export default function App() {
  return (
    <AppDataProvider>
      <Gate />
    </AppDataProvider>
  )
}
