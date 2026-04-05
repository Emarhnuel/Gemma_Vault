import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  SendHorizontal,
  Receipt,
  CreditCard,
  User,
} from 'lucide-react'

const mobileItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/send', label: 'Send', icon: SendHorizontal },
  { to: '/payments', label: 'Pay', icon: Receipt },
  { to: '/cards', label: 'Cards', icon: CreditCard },
  { to: '/account', label: 'Account', icon: User },
]

export default function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t py-2 backdrop-blur-lg"
      style={{
        backgroundColor: 'oklch(0.14 0.004 260 / 0.92)',
        borderColor: 'var(--border-subtle)',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      {mobileItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors duration-200
            ${isActive
              ? 'text-[var(--primary)]'
              : 'text-[var(--foreground-muted)]'
            }`
          }
          style={{ touchAction: 'manipulation' }}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
