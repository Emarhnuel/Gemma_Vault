import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppLayout from '@/components/layout/AppLayout'

/* Code-split pages for performance (bundle-dynamic-imports) */
const Home = lazy(() => import('@/pages/Home'))
const Solutions = lazy(() => import('@/pages/Solutions'))
const Product = lazy(() => import('@/pages/Product'))
const Company = lazy(() => import('@/pages/Company'))
const SignUp = lazy(() => import('@/pages/SignUp'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const SendMoney = lazy(() => import('@/pages/SendMoney'))
const Payments = lazy(() => import('@/pages/Payments'))
const Cards = lazy(() => import('@/pages/Cards'))
const Beneficiaries = lazy(() => import('@/pages/Beneficiaries'))
const Statements = lazy(() => import('@/pages/Statements'))
const Account = lazy(() => import('@/pages/Account'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
        />
        <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
          Loading…
        </span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/solutions"
          element={<Suspense fallback={<PageLoader />}><Solutions /></Suspense>}
        />
        <Route
          path="/product"
          element={<Suspense fallback={<PageLoader />}><Product /></Suspense>}
        />
        <Route
          path="/company"
          element={<Suspense fallback={<PageLoader />}><Company /></Suspense>}
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<PageLoader />}>
              <SignUp />
            </Suspense>
          }
        />
        <Route path="/dashboard" element={<AppLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="send"
            element={
              <Suspense fallback={<PageLoader />}>
                <SendMoney />
              </Suspense>
            }
          />
          <Route
            path="payments"
            element={
              <Suspense fallback={<PageLoader />}>
                <Payments />
              </Suspense>
            }
          />
          <Route
            path="cards"
            element={
              <Suspense fallback={<PageLoader />}>
                <Cards />
              </Suspense>
            }
          />
          <Route
            path="beneficiaries"
            element={
              <Suspense fallback={<PageLoader />}>
                <Beneficiaries />
              </Suspense>
            }
          />
          <Route
            path="statements"
            element={
              <Suspense fallback={<PageLoader />}>
                <Statements />
              </Suspense>
            }
          />
          <Route
            path="account"
            element={
              <Suspense fallback={<PageLoader />}>
                <Account />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
