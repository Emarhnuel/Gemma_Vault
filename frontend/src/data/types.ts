export interface UserAccount {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  accountNumber: string
  sortCode: string
  balance: number
  currency: string
  avatar: string | null
}

export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  currency: string
  description: string
  category: string
  date: string
  recipient: string | null
  status: 'completed' | 'pending' | 'failed'
}

export interface Beneficiary {
  id: string
  name: string
  accountNumber: string
  sortCode: string
  bank: string
  avatar: string | null
}

export interface Card {
  id: string
  type: 'debit' | 'credit'
  lastFour: string
  expiryDate: string
  cardholderName: string
  isActive: boolean
  isFrozen: boolean
  dailyLimit: number
  spent: number
}

export interface BillCategory {
  id: string
  name: string
  icon: string
  providers: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  action?: ChatAction
}

export interface ChatAction {
  type: 'transfer_confirm' | 'bill_confirm' | 'card_action' | 'info'
  data: Record<string, unknown>
  status: 'pending' | 'confirmed' | 'rejected'
}
