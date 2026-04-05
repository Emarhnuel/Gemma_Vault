import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Receipt,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  Phone,
  Wifi,
  Droplets,
  Dice5,
  Tv
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { mockBillCategories } from '@/data/mockData'
import { formatCurrency, generateId } from '@/lib/utils'

const IconMap: Record<string, React.ElementType> = {
  Zap,
  Phone,
  Wifi,
  Droplets,
  Dice5,
  Tv
}

const paymentSchema = z.object({
  categoryId: z.string().min(1, "Select a category"),
  provider: z.string().min(1, "Select a provider"),
  customerReference: z.string().min(3, "Reference required"),
  amount: z.number({ message: "Must be a valid number" }).min(0.01, "Amount must be greater than 0")
})

type PaymentForm = z.infer<typeof paymentSchema>

export default function Payments() {
  const { user, addTransaction } = useAppStore()
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form')
  const [pendingTxData, setPendingTxData] = useState<PaymentForm | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
  })

  const watchAmount = watch('amount')
  const selectedCategory = watch('categoryId')
  const categoryData = mockBillCategories.find(c => c.id === selectedCategory)

  const onSubmit = (data: PaymentForm) => {
    setPendingTxData(data)
    setStep('confirm')
  }

  const handleConfirm = () => {
    if (!pendingTxData) return
    const categoryName = mockBillCategories.find(c => c.id === pendingTxData.categoryId)?.name || 'Bill'

    addTransaction({
      id: generateId('txn'),
      type: 'debit',
      amount: pendingTxData.amount,
      currency: 'GBP',
      description: `${categoryName} — ${pendingTxData.provider}`,
      category: 'bills',
      date: new Date().toISOString(),
      recipient: pendingTxData.provider,
      status: 'completed',
    })

    setStep('success')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, var(--color-info-400), var(--color-info-500))',
          }}
        >
          <Receipt size={20} style={{ color: 'var(--color-charcoal-950)' }} />
        </div>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}
          >
            Payments & Accounts
          </h2>
          <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Pay your bills instantly
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Left Col: Categories */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground-secondary)' }}>Bill Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {mockBillCategories.map(cat => {
                  const Icon = IconMap[cat.icon] || Receipt
                  const isSelected = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setValue('categoryId', cat.id, { shouldValidate: true })
                        setValue('provider', '', { shouldValidate: true }) // reset provider
                      }}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200"
                      style={{
                        backgroundColor: isSelected ? 'oklch(0.62 0.14 245 / 0.1)' : 'var(--surface)',
                        borderColor: isSelected ? 'var(--info)' : 'var(--border-subtle)',
                        color: isSelected ? 'var(--info)' : 'var(--foreground-muted)'
                      }}
                    >
                      <Icon size={24} />
                      <span className="text-xs font-medium" style={{ color: isSelected ? 'var(--foreground)' : 'var(--foreground-secondary)' }}>{cat.name}</span>
                    </button>
                  )
                })}
              </div>
              {errors.categoryId && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.categoryId.message}</p>}
            </div>

            {/* Right Col: Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Provider</label>
                <select
                  {...register('provider')}
                  disabled={!selectedCategory}
                  className="w-full h-11 px-4 rounded-xl border appearance-none outline-none transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: errors.provider ? 'var(--danger)' : 'var(--border-subtle)',
                    color: 'var(--foreground)'
                  }}
                >
                  <option value="">{selectedCategory ? '-- Select Provider --' : 'Select a category first'}</option>
                  {categoryData?.providers.map((p: string) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.provider && <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.provider.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Account Number / Ref</label>
                <input
                  {...register('customerReference')}
                  disabled={!selectedCategory}
                  className="w-full h-11 px-4 rounded-xl border outline-none disabled:opacity-50"
                  style={{ backgroundColor: 'var(--surface-elevated)', borderColor: errors.customerReference ? 'var(--danger)' : 'var(--border-subtle)', color: 'var(--foreground)' }}
                  placeholder="e.g. 12345678"
                />
                {errors.customerReference && <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.customerReference.message}</p>}
              </div>

              <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <label className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl" style={{ color: 'var(--foreground-muted)' }}>£</span>
                  <input
                    type="number"
                    step="0.01"
                    {...register('amount', { valueAsNumber: true })}
                    disabled={!selectedCategory}
                    className="w-full h-16 pl-10 pr-4 text-3xl font-bold bg-transparent border-b-2 rounded-none outline-none tabular-nums disabled:opacity-50"
                    style={{ borderColor: errors.amount ? 'var(--danger)' : 'var(--border-subtle)', color: 'var(--foreground)' }}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="flex items-center gap-1.5 text-xs mt-1" style={{ color: 'var(--danger)' }}>
                    <AlertCircle size={14} /> {errors.amount.message}
                  </p>
                )}
                {watchAmount > user.balance && (
                  <p className="flex items-center gap-1.5 text-xs mt-1" style={{ color: 'var(--danger)' }}>
                    <AlertCircle size={14} /> Insufficient funds (Bal: {formatCurrency(user.balance)})
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || watchAmount > user.balance || !watchAmount}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                style={{
                  background: 'linear-gradient(135deg, var(--color-info-400), var(--color-info-600))',
                  color: 'var(--color-charcoal-950)'
                }}
              >
                Proceed to Pay <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl border p-6 space-y-6 shadow-sm max-w-md mx-auto"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="text-center space-y-2">
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Bill Amount</p>
              <h2 className="text-4xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>
                {formatCurrency(pendingTxData?.amount || 0)}
              </h2>
            </div>

            <div className="rounded-xl border p-4 space-y-4" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Provider</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{pendingTxData?.provider}</span>
              </div>
              <div className="h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Account Ref</span>
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  {pendingTxData?.customerReference}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 h-12 rounded-xl font-semibold transition-colors duration-200 border"
                style={{ backgroundColor: 'transparent', borderColor: 'var(--border-subtle)', color: 'var(--foreground)' }}
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-[2] h-12 rounded-xl font-semibold transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, var(--color-info-400), var(--color-info-600))',
                  color: 'var(--color-charcoal-950)',
                  boxShadow: '0 4px 14px 0 oklch(0.62 0.14 245 / 0.3)'
                }}
              >
                Confirm Payment
              </button>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border p-10 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: 'oklch(0.72 0.17 155 / 0.15)', color: 'var(--success)' }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>
              Payment Successful
            </h2>
            <p className="text-sm max-w-[250px]" style={{ color: 'var(--foreground-muted)' }}>
              Your bill has been paid. It may take up to 2 hours to reflect on your provider's end.
            </p>
            <button
              onClick={() => {
                setValue('amount', 0, { shouldValidate: false })
                setValue('customerReference', '', { shouldValidate: false })
                setStep('form')
                setPendingTxData(null)
              }}
              className="mt-6 px-6 h-11 rounded-xl font-medium transition-colors border"
              style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--foreground)' }}
            >
              Pay another bill
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
