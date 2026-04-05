import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

type FilterType = 'all' | 'in' | 'out'

export default function Statements() {
  const transactions = useAppStore((s) => s.transactions)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      // Type filter
      if (filter === 'in' && txn.type !== 'credit') return false
      if (filter === 'out' && txn.type !== 'debit') return false
      
      // Search filter
      if (search) {
        const query = search.toLowerCase()
        return (
          txn.description.toLowerCase().includes(query) ||
          txn.category.toLowerCase().includes(query) ||
          (txn.recipient && txn.recipient.toLowerCase().includes(query))
        )
      }
      return true
    })
  }, [transactions, filter, search])

  // Group by date (simple implementation)
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof transactions> = {}
    
    filteredTransactions.forEach(txn => {
      // Format grouping key (e.g., "April 4, 2026")
      const date = new Date(txn.date)
      const key = new Intl.DateTimeFormat('en-GB', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
      
      if (!groups[key]) groups[key] = []
      groups[key].push(txn)
    })
    
    return groups
  }, [filteredTransactions])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))',
          }}
        >
          <FileText size={20} style={{ color: 'var(--color-charcoal-950)' }} />
        </div>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}
          >
            Statements & History
          </h2>
          <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
            View and manage your full transaction history
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--foreground-muted)' }} />
          <input 
            type="text" 
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border outline-none text-sm transition-colors duration-200 focus:border-[var(--color-gold-500)]"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--foreground)' }}
          />
        </div>

        {/* Filters */}
        <div 
          className="flex p-1 rounded-xl w-full sm:w-auto"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-subtle)' }}
        >
          {(['all', 'in', 'out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 capitalize"
              style={{
                backgroundColor: filter === f ? 'var(--surface-elevated)' : 'transparent',
                color: filter === f ? 'var(--foreground)' : 'var(--foreground-muted)',
                boxShadow: filter === f ? '0 2px 8px -2px rgba(0,0,0,0.4)' : 'none'
              }}
            >
              {f === 'all' ? 'All' : f === 'in' ? 'Money In' : 'Money Out'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {Object.entries(groupedTransactions).map(([date, txns]) => (
            <motion.div 
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
            >
              <h3 className="text-xs font-semibold px-2 uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>
                {date}
              </h3>
              
              <div 
                className="rounded-xl overflow-hidden border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
              >
                {txns.map((txn, index) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 transition-colors duration-200 hover:bg-[var(--surface-elevated)]"
                    style={{ 
                      borderBottom: index < txns.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                    }}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                        style={{
                          backgroundColor: txn.type === 'credit'
                            ? 'oklch(0.72 0.17 155 / 0.12)'
                            : 'oklch(0.70 0.18 25 / 0.1)',
                          color: txn.type === 'credit' ? 'var(--success)' : 'var(--foreground-secondary)',
                        }}
                      >
                        {txn.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                          {txn.description}
                        </p>
                        <p className="text-xs capitalize" style={{ color: 'var(--foreground-muted)' }}>
                          {txn.category} • {formatRelativeTime(txn.date)}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-sm font-semibold tabular-nums flex-shrink-0 ml-4"
                      style={{
                        color: txn.type === 'credit' ? 'var(--success)' : 'var(--foreground)',
                      }}
                    >
                      {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {filteredTransactions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                <Filter size={24} style={{ color: 'var(--foreground-muted)' }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>No transactions found</h3>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  )
}
