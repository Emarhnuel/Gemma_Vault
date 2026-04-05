import { useLocation } from 'react-router-dom'
import { Bell, MessageSquare, Search } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { getInitials } from '@/lib/utils'

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/send': 'Send Money',
  '/dashboard/payments': 'Payments & Bills',
  '/dashboard/cards': 'Cards',
  '/dashboard/beneficiaries': 'Beneficiaries',
  '/dashboard/statements': 'Statements',
  '/dashboard/account': 'Account',
}

export default function Header() {
  const location = useLocation()
  const user = useAppStore((s) => s.user)
  const toggleChat = useAppStore((s) => s.toggleChat)
  const title = routeTitles[location.pathname] || 'GemmaVault'

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 border-b backdrop-blur-md"
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Page title */}
      <div>
        <h1
          className="text-xl font-semibold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}
        >
          {title}
        </h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 hover:bg-[var(--surface-elevated)]"
          style={{ color: 'var(--foreground-secondary)' }}
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 hover:bg-[var(--surface-elevated)]"
          style={{ color: 'var(--foreground-secondary)' }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-gold-400)' }}
          />
        </button>

        {/* AI Chat toggle */}
        <button
          onClick={toggleChat}
          className="flex items-center gap-2 px-3 h-10 rounded-lg transition-all duration-200 hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, var(--color-gold-500), var(--color-gold-700))',
            color: 'var(--color-charcoal-950)',
          }}
          aria-label="Open AI assistant"
        >
          <MessageSquare size={16} />
          <span className="text-sm font-semibold hidden sm:inline">AI Assistant</span>
        </button>

        {/* User avatar */}
        <div
          className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold ml-1"
          style={{
            backgroundColor: 'var(--color-gold-400)',
            color: 'var(--color-charcoal-950)',
          }}
          aria-label={`${user.firstName} ${user.lastName}`}
        >
          {getInitials(`${user.firstName} ${user.lastName}`)}
        </div>
      </div>
    </header>
  )
}
