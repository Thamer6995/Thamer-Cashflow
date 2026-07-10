import type { AppData } from './types'

const STORAGE_KEY = 'thamer-cashflow-data-v1'

const defaultData: AppData = {
  openingBalance: null,
  openingBalanceDate: null,
  categories: [
    { id: 'inc-salary', name: 'راتب', type: 'income' },
    { id: 'inc-other', name: 'إيرادات أخرى', type: 'income' },
    { id: 'exp-rent', name: 'إيجار', type: 'expense' },
    { id: 'exp-food', name: 'مأكل ومشرب', type: 'expense' },
    { id: 'exp-transport', name: 'مواصلات', type: 'expense' },
    { id: 'exp-other', name: 'مصاريف أخرى', type: 'expense' },
  ],
  transactions: [],
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultData)
    const parsed = JSON.parse(raw) as AppData
    return {
      openingBalance: parsed.openingBalance ?? null,
      openingBalanceDate: parsed.openingBalanceDate ?? null,
      categories: parsed.categories ?? [],
      transactions: parsed.transactions ?? [],
    }
  } catch {
    return structuredClone(defaultData)
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
