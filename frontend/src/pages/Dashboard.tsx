import { motion, type Variants } from 'framer-motion'
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Wallet,
  Activity,
  ArrowRight
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { spendingByCategory } from '@/data/mockData'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useNavigate } from 'react-router-dom'

const mockAreaChartData = [
  { name: 'Mon', income: 4000, spend: 2400 },
  { name: 'Tue', income: 3000, spend: 1398 },
  { name: 'Wed', income: 2000, spend: 9800 },
  { name: 'Thu', income: 2780, spend: 3908 },
  { name: 'Fri', income: 1890, spend: 4800 },
  { name: 'Sat', income: 2390, spend: 3800 },
  { name: 'Sun', income: 3490, spend: 4300 },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function Dashboard() {
  const user = useAppStore((s) => s.user)
  const transactions = useAppStore((s) => s.transactions)
  const navigate = useNavigate()
  const recentTransactions = transactions.slice(0, 5)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 max-w-7xl mx-auto w-full pt-4 pb-12"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Overview</h2>
          <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Here's your financial summary for this month.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard/send')} className="h-9 px-4 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>Send Transfer</button>
          <button onClick={() => navigate('/dashboard/payments')} className="h-9 px-4 rounded-lg text-sm font-medium transition-colors border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)', color: 'var(--foreground)' }}>Pay Bills</button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="p-5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground-muted)' }}>Total Balance</span>
            <Wallet size={16} style={{ color: 'var(--foreground-muted)' }} />
          </div>
          <div>
            <h3 className="text-3xl font-bold tabular-nums tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>{formatCurrency(user.balance)}</h3>
            <div className="flex items-center gap-1.5 text-xs text-[var(--success)]">
              <TrendingUp size={14} /> <span>+2.4% from last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="p-5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground-muted)' }}>Monthly Income</span>
            <ArrowDownLeft size={16} style={{ color: 'var(--foreground-muted)' }} />
          </div>
          <div>
            <h3 className="text-2xl font-bold tabular-nums mb-1" style={{ color: 'var(--foreground)' }}>{formatCurrency(6450.00)}</h3>
            <div className="flex items-center gap-1.5 text-xs text-[var(--success)]">
              <TrendingUp size={14} /> <span>+12.5% vs avg</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="p-5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground-muted)' }}>Monthly Spend</span>
            <ArrowUpRight size={16} style={{ color: 'var(--foreground-muted)' }} />
          </div>
          <div>
            <h3 className="text-2xl font-bold tabular-nums mb-1" style={{ color: 'var(--foreground)' }}>{formatCurrency(2145.42)}</h3>
            <div className="flex items-center gap-1.5 text-xs text-[var(--danger)]">
              <TrendingUp size={14} /> <span>+4.1% vs avg</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="p-5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground-muted)' }}>Active Cards</span>
            <CreditCard size={16} style={{ color: 'var(--foreground-muted)' }} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>2</h3>
            <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>1 Physical, 1 Virtual</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart area */}
        <motion.div variants={itemVariants} className="lg:col-span-2 rounded-xl border p-5 flex flex-col" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Cash Flow</h3>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Income vs Spend over the last 7 days</p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }}/> Income</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--danger)' }}/> Spend</div>
            </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAreaChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }} tickFormatter={(val) => `£${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="income" stroke="var(--success)" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="spend" stroke="var(--danger)" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Insight & Breakdown */}
        <motion.div variants={itemVariants} className="flex flex-col h-full">
          <div className="rounded-xl border p-5 flex flex-col h-full" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Spend Distribution</h3>
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={spendingByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                    {spendingByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '12px' }} formatter={(val: any) => formatCurrency(Number(val))} />
                </PieChart>
              </ResponsiveContainer>
              {/* Optional centered text overlay could go here */}
            </div>
            <div className="mt-4 space-y-2">
              {spendingByCategory.slice(0, 3).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span style={{ color: 'var(--foreground-secondary)' }}>{cat.name}</span>
                  </div>
                  <span className="font-medium tabular-nums" style={{ color: 'var(--foreground)' }}>{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 rounded-xl border p-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Recent Activity</h3>
            <button onClick={() => navigate('/dashboard/statements')} className="text-xs font-medium flex items-center gap-1 transition-colors" style={{ color: 'var(--primary)' }}>View All <ArrowRight size={12} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th className="pb-2 text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>Transaction</th>
                  <th className="pb-2 text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>Category</th>
                  <th className="pb-2 text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>Date</th>
                  <th className="pb-2 text-xs font-medium text-right" style={{ color: 'var(--foreground-muted)' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn, idx) => (
                  <tr key={txn.id} style={{ borderBottom: idx !== recentTransactions.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: txn.type === 'credit' ? 'oklch(0.72 0.17 155 / 0.1)' : 'var(--surface-elevated)', color: txn.type === 'credit' ? 'var(--success)' : 'var(--foreground-secondary)' }}>
                           {txn.type === 'credit' ? <ArrowDownLeft size={14} /> : <TrendingDown size={14} />}
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{txn.description}</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs capitalize" style={{ color: 'var(--foreground-secondary)' }}>{txn.category}</td>
                    <td className="py-3 text-xs tabular-nums" style={{ color: 'var(--foreground-secondary)' }}>{formatRelativeTime(txn.date)}</td>
                    <td className="py-3 text-sm font-semibold tabular-nums text-right" style={{ color: txn.type === 'credit' ? 'var(--success)' : 'var(--foreground)' }}>
                      {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border p-5 flex flex-col justify-between" style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={18} />
              <h3 className="text-sm font-semibold">AI Assistant Insights</h3>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Your transport spending is trending 20% higher this week. We recommend reviewing your upcoming direct debits to avoid overdrafts.
            </p>
          </div>
          <button className="mt-6 w-full h-10 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--primary-foreground)', color: 'var(--primary)' }}>
            Open Chat
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
