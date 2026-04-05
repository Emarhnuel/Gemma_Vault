import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Trash2, UserCircle, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppStore } from '@/store/useAppStore'
import { generateId } from '@/lib/utils'

const beneficiarySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  accountNumber: z.string().length(8, 'Account number must be 8 digits').regex(/^\d+$/, 'Must be digits only'),
  sortCode: z.string().length(8, 'Sort code must be format XX-XX-XX').regex(/^\d{2}-\d{2}-\d{2}$/, 'Format: XX-XX-XX'),
  bank: z.string().min(2, 'Bank name is required'),
})

type BeneficiaryForm = z.infer<typeof beneficiarySchema>

export default function Beneficiaries() {
  const { beneficiaries, addBeneficiary, removeBeneficiary } = useAppStore()
  const [isAdding, setIsAdding] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<BeneficiaryForm>({
    resolver: zodResolver(beneficiarySchema),
    mode: 'onChange'
  })

  const onSubmit = (data: BeneficiaryForm) => {
    addBeneficiary({
      id: generateId('ben'),
      name: data.name,
      accountNumber: data.accountNumber,
      sortCode: data.sortCode,
      bank: data.bank,
      avatar: null
    })
    setSuccessMsg(`Successfully added ${data.name}`)
    setIsAdding(false)
    reset()
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, var(--color-success-400), var(--color-success-600))',
            }}
          >
            <Users size={20} style={{ color: 'var(--color-charcoal-950)' }} />
          </div>
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}
            >
              Beneficiaries
            </h2>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Manage your saved recipients
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsAdding(!isAdding)
            setSuccessMsg('')
          }}
          className="flex items-center gap-2 h-10 px-4 rounded-xl font-medium transition-colors border"
          style={{ 
            backgroundColor: isAdding ? 'var(--surface-elevated)' : 'var(--surface)', 
            borderColor: 'var(--border-subtle)', 
            color: 'var(--foreground)' 
          }}
        >
          {isAdding ? 'Cancel' : <><Plus size={16} /> Add New</>}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: 'oklch(0.72 0.17 155 / 0.1)', border: '1px solid var(--success)' }}
          >
            <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95, margin: 0 }}
              className="lg:col-span-1 overflow-hidden"
            >
              <form 
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-2xl border p-5 space-y-4"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
              >
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Add New Beneficiary</h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground-secondary)' }}>Full Name</label>
                  <input
                    {...register('name')}
                    placeholder="e.g. John Doe"
                    className="w-full h-10 px-3 rounded-xl border outline-none text-sm transition-colors focus:border-[var(--color-success-500)]"
                    style={{ backgroundColor: 'var(--surface-elevated)', borderColor: errors.name ? 'var(--danger)' : 'var(--border-subtle)', color: 'var(--foreground)' }}
                  />
                  {errors.name && <p className="text-[10px]" style={{ color: 'var(--danger)' }}>{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: 'var(--foreground-secondary)' }}>Bank Name</label>
                  <input
                    {...register('bank')}
                    placeholder="e.g. HSBC"
                    className="w-full h-10 px-3 rounded-xl border outline-none text-sm transition-colors focus:border-[var(--color-success-500)]"
                    style={{ backgroundColor: 'var(--surface-elevated)', borderColor: errors.bank ? 'var(--danger)' : 'var(--border-subtle)', color: 'var(--foreground)' }}
                  />
                  {errors.bank && <p className="text-[10px]" style={{ color: 'var(--danger)' }}>{errors.bank.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium" style={{ color: 'var(--foreground-secondary)' }}>Sort Code</label>
                    <input
                      {...register('sortCode')}
                      placeholder="12-34-56"
                      className="w-full h-10 px-3 rounded-xl border outline-none text-sm transition-colors focus:border-[var(--color-success-500)]"
                      style={{ backgroundColor: 'var(--surface-elevated)', borderColor: errors.sortCode ? 'var(--danger)' : 'var(--border-subtle)', color: 'var(--foreground)' }}
                    />
                    {errors.sortCode && <p className="text-[10px]" style={{ color: 'var(--danger)' }}>{errors.sortCode.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium" style={{ color: 'var(--foreground-secondary)' }}>Account Number</label>
                    <input
                      {...register('accountNumber')}
                      placeholder="12345678"
                      className="w-full h-10 px-3 rounded-xl border outline-none text-sm transition-colors focus:border-[var(--color-success-500)]"
                      style={{ backgroundColor: 'var(--surface-elevated)', borderColor: errors.accountNumber ? 'var(--danger)' : 'var(--border-subtle)', color: 'var(--foreground)' }}
                    />
                    {errors.accountNumber && <p className="text-[10px]" style={{ color: 'var(--danger)' }}>{errors.accountNumber.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  className="w-full h-10 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 mt-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-success-400), var(--color-success-600))',
                    color: 'var(--color-charcoal-950)'
                  }}
                >
                  Save Beneficiary
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isAdding ? 'lg:col-span-2' : 'lg:col-span-3 lg:grid-cols-3'}`}>
          <AnimatePresence>
            {beneficiaries.map((ben) => (
              <motion.div
                key={ben.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-2xl border p-5 relative overflow-hidden group transition-colors hover:bg-[var(--surface-elevated)]"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
                      <UserCircle size={24} style={{ color: 'var(--foreground-muted)' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{ben.name}</h4>
                      <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{ben.bank}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBeneficiary(ben.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[oklch(0.70_0.18_25_/_0.15)] focus:opacity-100"
                    style={{ color: 'var(--danger)' }}
                    title="Remove Beneficiary"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span style={{ color: 'var(--foreground-secondary)' }}>Sort Code</span>
                    <span className="font-mono" style={{ color: 'var(--foreground)' }}>{ben.sortCode}</span>
                  </div>
                  <div className="h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
                  <div className="flex justify-between items-center text-xs">
                    <span style={{ color: 'var(--foreground-secondary)' }}>Account Number</span>
                    <span className="font-mono" style={{ color: 'var(--foreground)' }}>{ben.accountNumber}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
