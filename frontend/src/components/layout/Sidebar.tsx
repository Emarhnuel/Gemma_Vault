import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  SendHorizontal,
  Receipt,
  CreditCard,
  Users,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sun,
  Moon,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTheme } from '@/components/ThemeProvider'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/send', label: 'Send Money', icon: SendHorizontal },
  { to: '/dashboard/payments', label: 'Payments', icon: Receipt },
  { to: '/dashboard/cards', label: 'Cards', icon: CreditCard },
  { to: '/dashboard/beneficiaries', label: 'Beneficiaries', icon: Users },
  { to: '/dashboard/statements', label: 'Statements', icon: FileText },
  { to: '/dashboard/account', label: 'Account', icon: User },
]

export default function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggle = useAppStore((s) => s.toggleSidebar)
  const { theme, toggleTheme } = useTheme()

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Logo */}
      <Link 
        to="/"
        className="flex items-center gap-3 px-5 border-b hover:opacity-80 transition-opacity"
        style={{
          height: 'var(--header-height)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))',
          }}
        >
          <Shield size={20} style={{ color: 'var(--color-charcoal-950)' }} />
        </div>
        {!collapsed && (
          <span
            className="text-gradient-gold font-semibold text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            GemmaVault
          </span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive
                ? 'text-[var(--primary)] bg-[var(--color-gold-400)]/10'
                : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)]'
              }`
            }
          >
            <item.icon
              size={20}
              className="flex-shrink-0"
            />
            {!collapsed && (
              <span className="text-sm font-medium truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer controls: Theme & Collapse */}
      <div className="p-3 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          onClick={toggleTheme}
          className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start gap-3 px-3'} w-full py-2 rounded-lg transition-colors duration-200 hover:bg-[var(--surface-elevated)]`}
          style={{ color: 'var(--foreground-muted)' }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span className="text-sm font-medium">Theme</span>}
        </button>

        <button
          onClick={toggle}
          className="flex items-center justify-center w-full py-2 rounded-lg transition-colors duration-200 hover:bg-[var(--surface-elevated)]"
          style={{ color: 'var(--foreground-muted)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  )
}
