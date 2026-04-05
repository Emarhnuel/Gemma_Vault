import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  SendHorizontal,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  AlertCircle
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { formatCurrency, generateId } from '@/lib/utils'

// Zod Schema for validation
const sendMoneySchema = z.object({
  amount: z.number({ message: "Must be a valid number" }).min(0.01, "Amount must be greater than 0"),
  recipientOption: z.enum(['beneficiary', 'new']),
  beneficiaryId: z.string().optional(),
  newRecipientName: z.string().optional(),
  sortCode: z.string().optional(),
  accountNumber: z.string().optional(),
  reference: z.string().max(30, "Reference too long").optional(),
}).superRefine((data, ctx) => {
  if (data.recipientOption === 'beneficiary' && !data.beneficiaryId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Select a beneficiary", path: ['beneficiaryId'] })
  }
  if (data.recipientOption === 'new') {
    if (!data.newRecipientName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required", path: ['newRecipientName'] })
    }
    if (!data.sortCode?.match(/^\d{2}-?\d{2}-?\d{2}$/)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid Sort Code", path: ['sortCode'] })
    }
    if (!data.accountNumber?.match(/^\d{8}$/)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be 8 digits", path: ['accountNumber'] })
    }
  }
})

type SendMoneyForm = z.infer<typeof sendMoneySchema>

export default function SendMoney() {
  const { user, beneficiaries, addTransaction } = useAppStore()
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form')
  const [pendingTxData, setPendingTxData] = useState<SendMoneyForm | null>(null)

  const { register, handleSubmit, watch, control, formState: { errors, isValid } } = useForm<SendMoneyForm>({
    resolver: zodResolver(sendMoneySchema),
    mode: 'onChange',
    defaultValues: {
      recipientOption: 'beneficiary',
      amount: undefined,
      reference: '',
    }
  })

  const recipientOption = watch('recipientOption')
  const watchAmount = watch('amount')

  const onSubmit = (data: SendMoneyForm) => {
    setPendingTxData(data)
    setStep('confirm')
  }

  const handleConfirm = () => {
    if (!pendingTxData) return
    const recipientName =
      pendingTxData.recipientOption === 'beneficiary'
        ? beneficiaries.find(b => b.id === pendingTxData.beneficiaryId)?.name || 'Unknown'
        : pendingTxData.newRecipientName || 'Unknown'

    // Add to transaction history
    addTransaction({
      id: generateId('txn'),
      type: 'debit',
      amount: pendingTxData.amount,
      currency: 'GBP',
      description: pendingTxData.reference || 'Bank Transfer',
      category: 'transfer',
      date: new Date().toISOString(),
      recipient: recipientName,
      status: 'completed',
    })

    setStep('success')
  }

  const getRecipientDisplay = () => {
    if (!pendingTxData) return null
    if (pendingTxData.recipientOption === 'beneficiary') {
      const ben = beneficiaries.find(b => b.id === pendingTxData.beneficiaryId)
      return (
        <div className="flex flex-col">
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{ben?.name}</span>
          <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{ben?.bank} • {ben?.accountNumber}</span>
        </div>
      )
    }
    return (
      <div className="flex flex-col">
        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{pendingTxData.newRecipientName}</span>
        <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{pendingTxData.sortCode} • {pendingTxData.accountNumber}</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))',
          }}
        >
          <SendHorizontal size={20} style={{ color: 'var(--color-charcoal-950)' }} />
        </div>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}
          >
            Send Money
          </h2>
          <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Transfer funds to your contacts securely
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.form
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border p-6 space-y-6 shadow-sm"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
          >
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl" style={{ color: 'var(--foreground-muted)' }}>£</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  className="w-full h-16 pl-10 pr-4 text-3xl font-bold bg-transparent border-b-2 rounded-none outline-none tabular-nums transition-colors z-10 relative"
                  style={{ 
                    borderColor: errors.amount ? 'var(--danger)' : 'var(--border-subtle)',
                    color: 'var(--foreground)',
                  }}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="flex items-center gap-1.5 text-xs mt-1" style={{ color: 'var(--danger)' }}>
                  <AlertCircle size={14} /> {errors.amount.message}
                </p>
              )}
              <div className="flex justify-between items-center text-xs mt-2" style={{ color: 'var(--foreground-muted)' }}>
                <span>Available: {formatCurrency(user.balance)}</span>
                {watchAmount > user.balance && (
                  <span style={{ color: 'var(--danger)' }}>Insufficient funds</span>
                )}
              </div>
            </div>

            {/* Recipient Tabs */}
            <div className="space-y-4">
              <div
                className="flex p-1 rounded-xl"
                style={{ backgroundColor: 'var(--surface-elevated)' }}
              >
                <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${recipientOption === 'beneficiary' ? 'shadow-sm' : ''}`}
                  style={{
                    backgroundColor: recipientOption === 'beneficiary' ? 'var(--surface)' : 'transparent',
                    color: recipientOption === 'beneficiary' ? 'var(--foreground)' : 'var(--foreground-muted)',
                  }}
                >
                  <input type="radio" value="beneficiary" {...register('recipientOption')} className="sr-only" />
                  <Users size={16} /> Saved
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${recipientOption === 'new' ? 'shadow-sm' : ''}`}
                  style={{
                    backgroundColor: recipientOption === 'new' ? 'var(--surface)' : 'transparent',
                    color: recipientOption === 'new' ? 'var(--foreground)' : 'var(--foreground-muted)',
                  }}
                >
                  <input type="radio" value="new" {...register('recipientOption')} className="sr-only" />
                  <Building2 size={16} /> New Payee
                </label>
              </div>

              {/* Dynamic Recipient Fields */}
              <AnimatePresence mode="wait">
                {recipientOption === 'beneficiary' ? (
                  <motion.div key="ben" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Select Beneficiary</label>
                      <select
                        {...register('beneficiaryId')}
                        className="w-full h-11 px-4 rounded-xl border appearance-none outline-none transition-colors"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: errors.beneficiaryId ? 'var(--danger)' : 'var(--border-subtle)',
                          color: 'var(--foreground)'
                        }}
                      >
                        <option value="">-- Choose recipient --</option>
                        {beneficiaries.map(b => (
                          <option key={b.id} value={b.id}>{b.name} ({b.bank})</option>
                        ))}
                      </select>
                      {errors.beneficiaryId && <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.beneficiaryId.message}</p>}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="new" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    <div className="space-y-2 pt-1">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Full Name</label>
                      <input {...register('newRecipientName')} className="w-full h-11 px-4 rounded-xl border outline-none" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: errors.newRecipientName ? 'var(--danger)' : 'var(--border-subtle)', color: 'var(--foreground)' }} placeholder="e.g. John Doe" />
                      {errors.newRecipientName && <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.newRecipientName.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Sort Code</label>
                        <input {...register('sortCode')} className="w-full h-11 px-4 rounded-xl border outline-none" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: errors.sortCode ? 'var(--danger)' : 'var(--border-subtle)', color: 'var(--foreground)' }} placeholder="00-00-00" />
                        {errors.sortCode && <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.sortCode.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Account Number</label>
                        <input {...register('accountNumber')} className="w-full h-11 px-4 rounded-xl border outline-none" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: errors.accountNumber ? 'var(--danger)' : 'var(--border-subtle)', color: 'var(--foreground)' }} placeholder="12345678" />
                        {errors.accountNumber && <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.accountNumber.message}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reference */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>Reference (Optional)</label>
              <input
                {...register('reference')}
                className="w-full h-11 px-4 rounded-xl border outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: errors.reference ? 'var(--danger)' : 'var(--border-subtle)',
                  color: 'var(--foreground)'
                }}
                placeholder="e.g. Dinner share"
              />
              {errors.reference && <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.reference.message}</p>}
            </div>

            <button
              type="submit"
              disabled={!isValid || watchAmount > user.balance || !watchAmount}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))',
                color: 'var(--color-charcoal-950)'
              }}
            >
              Review Transfer <ArrowRight size={18} />
            </button>
          </motion.form>
        )}

        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl border p-6 space-y-6 shadow-sm"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="text-center space-y-2">
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>You are sending</p>
              <h2 className="text-4xl font-bold text-gradient-gold tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(pendingTxData?.amount || 0)}
              </h2>
            </div>

            <div className="rounded-xl border p-4 space-y-4" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>To</span>
                <div className="text-right">{getRecipientDisplay()}</div>
              </div>
              <div className="h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Reference</span>
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  {pendingTxData?.reference || 'None'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 h-12 rounded-xl font-semibold transition-colors duration-200 border"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--foreground)'
                }}
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-[2] h-12 rounded-xl font-semibold transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))',
                  color: 'var(--color-charcoal-950)',
                  boxShadow: '0 0 20px -5px oklch(0.78 0.14 85 / 0.3)'
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
            className="rounded-2xl border p-10 flex flex-col items-center justify-center text-center space-y-4 shadow-sm"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: 'oklch(0.72 0.17 155 / 0.15)', color: 'var(--success)' }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>
              Transfer Sent
            </h2>
            <p className="text-sm max-w-[250px]" style={{ color: 'var(--foreground-muted)' }}>
              Your money is on its way. It should arrive shortly.
            </p>
            <button
              onClick={() => {
                setStep('form')
                setPendingTxData(null)
              }}
              className="mt-6 px-6 h-11 rounded-xl font-medium transition-colors border"
              style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--foreground)' }}
            >
              Send another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
