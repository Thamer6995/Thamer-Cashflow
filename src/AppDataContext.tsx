import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppData, CategoryType, MonthSummary, Transaction } from './types'
import { loadData, saveData } from './storage'

interface AppDataContextValue {
  data: AppData
  setOpeningBalance: (amount: number, date: string) => void
  addCategory: (name: string, type: CategoryType) => void
  updateCategory: (id: string, name: string) => void
  deleteCategory: (id: string) => void
  addTransaction: (tx: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, tx: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  getMonthSummary: (monthKey: string) => MonthSummary
  getAvailableMonths: () => string[]
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function monthKeyOf(dateStr: string): string {
  return dateStr.slice(0, 7)
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const setOpeningBalance = (amount: number, date: string) => {
    setData((prev) => ({ ...prev, openingBalance: amount, openingBalanceDate: date }))
  }

  const addCategory = (name: string, type: CategoryType) => {
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, { id: uid(), name, type }],
    }))
  }

  const updateCategory = (id: string, name: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, name } : c)),
    }))
  }

  const deleteCategory = (id: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
      transactions: prev.transactions.filter((t) => t.categoryId !== id),
    }))
  }

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    setData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, { ...tx, id: uid() }],
    }))
  }

  const updateTransaction = (id: string, tx: Omit<Transaction, 'id'>) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === id ? { ...tx, id } : t)),
    }))
  }

  const deleteTransaction = (id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }))
  }

  const getMonthSummary = (monthKey: string): MonthSummary => {
    const opening = data.openingBalance ?? 0
    let priorNet = 0
    let monthIncome = 0
    let monthExpense = 0
    const incomeTotals = new Map<string, number>()
    const expenseTotals = new Map<string, number>()

    for (const t of data.transactions) {
      const tKey = monthKeyOf(t.date)
      const signed = t.type === 'income' ? t.amount : -t.amount
      if (tKey < monthKey) {
        priorNet += signed
      } else if (tKey === monthKey) {
        if (t.type === 'income') {
          monthIncome += t.amount
          incomeTotals.set(t.categoryId, (incomeTotals.get(t.categoryId) ?? 0) + t.amount)
        } else {
          monthExpense += t.amount
          expenseTotals.set(t.categoryId, (expenseTotals.get(t.categoryId) ?? 0) + t.amount)
        }
      }
    }

    const catById = new Map(data.categories.map((c) => [c.id, c]))
    const toBreakdown = (totals: Map<string, number>) =>
      Array.from(totals.entries())
        .map(([categoryId, total]) => {
          const category = catById.get(categoryId) ?? { id: categoryId, name: 'بند محذوف', type: 'expense' as const }
          return { category, total }
        })
        .sort((a, b) => b.total - a.total)

    const openingBalance = opening + priorNet
    return {
      monthKey,
      openingBalance,
      totalIncome: monthIncome,
      totalExpense: monthExpense,
      closingBalance: openingBalance + monthIncome - monthExpense,
      incomeByCategory: toBreakdown(incomeTotals),
      expenseByCategory: toBreakdown(expenseTotals),
    }
  }

  const getAvailableMonths = (): string[] => {
    const set = new Set<string>()
    if (data.openingBalanceDate) set.add(monthKeyOf(data.openingBalanceDate))
    for (const t of data.transactions) set.add(monthKeyOf(t.date))
    const now = new Date()
    set.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
    return Array.from(set).sort()
  }

  const value = useMemo(
    () => ({
      data,
      setOpeningBalance,
      addCategory,
      updateCategory,
      deleteCategory,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getMonthSummary,
      getAvailableMonths,
    }),
    [data],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
