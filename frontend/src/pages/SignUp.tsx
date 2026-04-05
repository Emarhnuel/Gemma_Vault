import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export default function SignUp() {
  const navigate = useNavigate()
  const setUser = useAppStore((s) => s.setUser)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call for creating account
    setTimeout(() => {
      setUser({
        firstName: formData.firstName || 'New',
        lastName: formData.lastName || 'User',
        email: formData.email || 'user@example.com',
      })
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] rounded-2xl p-8 border shadow-xl"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center justify-center rounded-xl shadow h-12 w-12 mb-4" style={{ background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))' }}>
            <Shield size={24} style={{ color: 'var(--color-charcoal-950)' }} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>
            Create your account
          </h1>
          <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Join GemmaVault for secure future banking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>First name</label>
              <input
                type="text"
                required
                className="w-full h-10 px-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)', outlineColor: 'var(--primary)' }}
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Last name</label>
              <input
                type="text"
                required
                className="w-full h-10 px-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)', outlineColor: 'var(--primary)' }}
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Email address</label>
            <input
              type="email"
              required
              className="w-full h-10 px-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)', outlineColor: 'var(--primary)' }}
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-full flex items-center justify-center gap-2 font-medium text-sm transition-all focus:outline-none focus:ring-2 mt-6"
            style={{ 
              backgroundColor: isSubmitting ? 'var(--foreground-muted)' : 'var(--primary)', 
              color: 'var(--primary-foreground)',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Creating account...' : 'Complete Sign Up'} 
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-sm font-medium mt-6" style={{ color: 'var(--foreground-muted)' }}>
          Already have an account?{' '}
          <Link to="/dashboard" className="transition-colors hover:underline" style={{ color: 'var(--primary)' }}>
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
