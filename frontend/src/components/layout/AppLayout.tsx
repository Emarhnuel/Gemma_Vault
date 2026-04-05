import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import ChatPanel from '@/components/chat/ChatPanel'
import MobileNav from './MobileNav'
import { useAppStore } from '@/store/useAppStore'

export default function AppLayout() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{
          marginLeft: `var(--sidebar-width)`,
        }}
      >
        {/* Responsive: collapse sidebar margin on desktop */}
        <style>{`
          @media (min-width: 768px) {
            .main-wrapper {
              margin-left: ${collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'};
            }
          }
          @media (max-width: 767px) {
            .main-wrapper {
              margin-left: 0;
            }
          }
        `}</style>

        <div className="main-wrapper flex flex-col min-h-screen transition-all duration-300">
          <Header />
          
          <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8" role="main">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* AI Chat Panel overlay */}
      <ChatPanel />
    </div>
  )
}
