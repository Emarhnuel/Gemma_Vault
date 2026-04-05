import { motion } from 'framer-motion'
import { User, Copy, CheckCircle2, MapPin, Mail, Phone, Shield, Bell } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

export default function Account() {
  const user = useAppStore((s) => s.user)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const CopyButton = ({ field, value }: { field: string, value: string }) => (
    <button
      onClick={() => handleCopy(field, value)}
      className="p-1.5 rounded-md transition-colors hover:bg-[var(--surface-elevated)]"
      style={{ color: copiedField === field ? 'var(--success)' : 'var(--foreground-muted)' }}
    >
      {copiedField === field ? <CheckCircle2 size={16} /> : <Copy size={16} />}
    </button>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, var(--color-charcoal-400), var(--color-charcoal-600))',
          }}
        >
          <User size={20} style={{ color: 'var(--color-charcoal-50)' }} />
        </div>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}
          >
            Account
          </h2>
          <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Your profile and bank details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Profile Card */}
        <div 
          className="md:col-span-1 border rounded-2xl p-6 text-center shadow-lg relative overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
        >
          <div 
            className="absolute top-0 left-0 w-full h-24"
            style={{ background: 'linear-gradient(135deg, oklch(0.18 0.015 85 / 0.5), oklch(0.25 0.05 260 / 0.3))' }}
          />
          <div 
            className="relative w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center shadow-lg bg-gradient-to-tr from-[var(--color-gold-400)] to-[var(--color-gold-600)] mb-4"
            style={{ borderColor: 'var(--surface)', color: 'var(--color-charcoal-950)' }}
          >
            <span className="text-3xl font-bold font-heading">{user.firstName[0]}{user.lastName[0]}</span>
          </div>
          
          <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>Demo Account</p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} style={{ color: 'var(--color-gold-400)' }} />
              <span className="truncate" style={{ color: 'var(--foreground-secondary)' }}>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} style={{ color: 'var(--color-info-400)' }} />
              <span style={{ color: 'var(--foreground-secondary)' }}>{user.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} style={{ color: 'var(--color-success-400)' }} />
              <span style={{ color: 'var(--foreground-secondary)' }}>London, UK</span>
            </div>
          </div>
          
          <button
            className="w-full mt-6 h-10 rounded-xl font-medium text-sm transition-colors border"
            style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--foreground)' }}
          >
            Edit Profile
          </button>
        </div>

        {/* Bank Details & Settings */}
        <div className="md:col-span-2 space-y-6">
          <div 
            className="rounded-2xl border p-6 space-y-5"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
          >
            <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Primary Account Details</h3>
            
            <div className="space-y-0 text-sm border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--surface)' }}>
                <span style={{ color: 'var(--foreground-muted)' }}>Account Name</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>{user.firstName} {user.lastName}</span>
              </div>
              <div className="h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
              
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                <span style={{ color: 'var(--foreground-muted)' }}>Sort Code</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono tracking-wider font-medium" style={{ color: 'var(--foreground)' }}>{user.sortCode}</span>
                  <CopyButton field="sortCode" value={user.sortCode} />
                </div>
              </div>
              <div className="h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
              
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--surface)' }}>
                <span style={{ color: 'var(--foreground-muted)' }}>Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono tracking-wider font-medium" style={{ color: 'var(--foreground)' }}>{user.accountNumber}</span>
                  <CopyButton field="accountNumber" value={user.accountNumber} />
                </div>
              </div>
              <div className="h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
              
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                <span style={{ color: 'var(--foreground-muted)' }}>IBAN</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono tracking-wider font-medium" style={{ color: 'var(--foreground)' }}>GB82 GEMM 2045 6712 3456 78</span>
                  <CopyButton field="iban" value="GB82GEMM20456712345678" />
                </div>
              </div>
            </div>
            
            <p className="text-xs flex items-center justify-center gap-1.5" style={{ color: 'var(--foreground-muted)' }}>
              <Shield size={14} style={{ color: 'var(--success)' }} />
              Your account details are securely encrypted
            </p>
          </div>

          <div 
            className="rounded-2xl border p-6 space-y-4"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
          >
            <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Security & Preferences</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border transition-colors hover:bg-[var(--surface-elevated)] cursor-pointer" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.62 0.14 245 / 0.15)', color: 'var(--info)' }}>
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Two-Factor Authentication</p>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Currently enabled</p>
                  </div>
                </div>
                <div className="w-10 h-6 rounded-full bg-[var(--success)] relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border transition-colors hover:bg-[var(--surface-elevated)] cursor-pointer" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.70 0.18 25 / 0.15)', color: 'var(--danger)' }}>
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Push Notifications</p>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>For transactions & alerts</p>
                  </div>
                </div>
                <div className="w-10 h-6 rounded-full bg-[var(--border-color)] relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </motion.div>
  )
}
