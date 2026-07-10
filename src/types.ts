export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: CategoryType
}

export interface Transaction {
  id: string
  date: string // YYYY-MM-DD
  categoryId: string
  type: CategoryType
  amount: number
  note?: string
}

export interface AppData {
  openingBalance: number | null
  openingBalanceDate: string | null // YYYY-MM-DD, date of first entry
  categories: Category[]
  transactions: Transaction[]
}

export interface MonthSummary {
  monthKey: string // YYYY-MM
  openingBalance: number
  totalIncome: number
  totalExpense: number
  closingBalance: number
  incomeByCategory: { category: Category; total: number }[]
  expenseByCategory: { category: Category; total: number }[]
}
