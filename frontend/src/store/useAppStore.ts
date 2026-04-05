import { create } from 'zustand'
import type { UserAccount, Transaction, Beneficiary, Card, ChatMessage } from '@/data/types'
import { mockUser, mockTransactions, mockBeneficiaries, mockCards } from '@/data/mockData'

interface AppState {
  /* User */
  user: UserAccount
  setUser: (updates: Partial<UserAccount>) => void
  
  /* Transactions */
  transactions: Transaction[]
  addTransaction: (txn: Transaction) => void
  
  /* Beneficiaries */
  beneficiaries: Beneficiary[]
  addBeneficiary: (ben: Beneficiary) => void
  removeBeneficiary: (id: string) => void
  
  /* Cards */
  cards: Card[]
  toggleFreezeCard: (id: string) => void
  
  /* Chat */
  chatOpen: boolean
  toggleChat: () => void
  setChatOpen: (open: boolean) => void
  chatMessages: ChatMessage[]
  addChatMessage: (msg: ChatMessage) => void
  updateChatMessage: (id: string, updates: Partial<ChatMessage>) => void
  
  /* Sidebar */
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  /* User — pre-loaded demo account */
  user: mockUser,
  setUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
  
  /* Transactions */
  transactions: mockTransactions,
  addTransaction: (txn) =>
    set((state) => ({ transactions: [txn, ...state.transactions] })),
  
  /* Beneficiaries */
  beneficiaries: mockBeneficiaries,
  addBeneficiary: (ben) =>
    set((state) => ({ beneficiaries: [...state.beneficiaries, ben] })),
  removeBeneficiary: (id) =>
    set((state) => ({
      beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
    })),
  
  /* Cards */
  cards: mockCards,
  toggleFreezeCard: (id) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, isFrozen: !c.isFrozen } : c
      ),
    })),
  
  /* Chat */
  chatOpen: false,
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  setChatOpen: (open) => set({ chatOpen: open }),
  chatMessages: [
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        'Hello Alex! 👋 I\u2019m your GemmaVault AI assistant. I can help you send money, check your balance, pay bills, or analyse your spending. What would you like to do?',
      timestamp: new Date().toISOString(),
    },
  ],
  addChatMessage: (msg) =>
    set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  updateChatMessage: (id, updates) =>
    set((state) => ({
      chatMessages: state.chatMessages.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    })),
  
  /* Sidebar */
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}))
