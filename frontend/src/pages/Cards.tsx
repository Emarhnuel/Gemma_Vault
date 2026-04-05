import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CreditCard, Lock, Eye, Settings, ShieldCheck, Zap } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { formatCurrency } from '@/lib/utils'

export default function Cards() {
  const cards = useAppStore((s) => s.cards)
  const user = useAppStore((s) => s.user)
  const card = cards[0] // Simple implementation: show first card
  const [showDetails, setShowDetails] = useState(false)

  // 3D Tilt Effect
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth out the motion
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    // Normalized position from -0.5 to 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5
    const mouseY = (e.clientY - rect.top) / height - 0.5

    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (!card) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-10"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))',
          }}
        >
          <CreditCard size={20} style={{ color: 'var(--color-charcoal-950)' }} />
        </div>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}
          >
            Your Cards
          </h2>
          <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Manage your physical and virtual cards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* 3D Card Container */}
        <div className="flex justify-center perspective-[1200px]">
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              x: 0,
              y: 0,
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full max-w-[340px] aspect-[1.586/1] rounded-2xl cursor-pointer"
          >
            {/* Front of Card */}
            <div 
              className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 pointer-events-none"
              style={{
                background: card.isFrozen 
                  ? 'linear-gradient(135deg, oklch(0.3 0.05 260), oklch(0.2 0.05 260))'
                  : 'linear-gradient(135deg, var(--color-gold-900), var(--color-charcoal-900))',
                /* Add a subtle gold border and reflective top inset */
                border: `1px solid ${card.isFrozen ? 'oklch(0.5 0.05 260)' : 'var(--color-gold-700)'}`,
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 20px 40px -10px rgba(0, 0, 0, 0.5)',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(20px)', // Lift contents slightly from the card base (3d effect)
              }}
            >
              {/* Reflective Sheen effect based on mouse */}
              <motion.div 
                className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 60%)',
                }}
              />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="font-bold text-lg tracking-widest" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-300)' }}>
                  Gemma<span style={{ color: 'var(--foreground)' }}>Vault</span>
                </div>
                <Zap size={24} style={{ color: 'var(--color-gold-400)' }} className="opacity-80" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="font-mono text-xl tracking-[4px]" style={{ color: 'var(--foreground)' }}>
                  {showDetails ? `4123 5890 1204 ${card.lastFour}` : `•••• •••• •••• ${card.lastFour}`}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider mb-1 opacity-70" style={{ color: 'var(--color-gold-400)' }}>Cardholder</div>
                    <div className="font-medium tracking-wide text-sm uppercase" style={{ color: 'var(--foreground)' }}>
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider mb-1 opacity-70 text-right" style={{ color: 'var(--color-gold-400)' }}>Valid Thru</div>
                    <div className="font-mono text-sm tracking-wider" style={{ color: 'var(--foreground)' }}>
                      {card.expiryDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Watermark Logo */}
              <div 
                className="absolute -bottom-10 -right-10 w-40 h-40 opacity-5"
                style={{ background: 'var(--color-gold-400)', borderRadius: '50%' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Card Controls */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>
              GemmaVault {card.type === 'debit' ? 'Debit' : 'Credit'} Card
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: card.isFrozen ? 'var(--danger)' : 'var(--success)' }} />
              <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                {card.isFrozen ? 'Card is currently frozen' : 'Active and ready to use'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => useAppStore.setState((s) => ({
                cards: s.cards.map((c) => c.id === card.id ? { ...c, isFrozen: !c.isFrozen } : c)
              }))}
              className="flex flex-col gap-2 p-4 rounded-xl border transition-colors hover:bg-[var(--surface-elevated)]"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: card.isFrozen ? 'oklch(0.70 0.18 25 / 0.15)' : 'var(--surface-elevated)', 
                  color: card.isFrozen ? 'var(--danger)' : 'var(--foreground)' 
                }}
              >
                <Lock size={16} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                  {card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>Temporarily lock it</p>
              </div>
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex flex-col gap-2 p-4 rounded-xl border transition-colors hover:bg-[var(--surface-elevated)]"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: showDetails ? 'oklch(0.62 0.14 245 / 0.15)' : 'var(--surface-elevated)', 
                  color: showDetails ? 'var(--info)' : 'var(--foreground)' 
                }}
              >
                <Eye size={16} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>View full number</p>
              </div>
            </button>
          </div>

          <div 
            className="rounded-xl border p-4 space-y-4"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} style={{ color: 'var(--color-gold-400)' }} />
              <div>
                <h4 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Spending Limit</h4>
                <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Daily limit: {formatCurrency(card.dailyLimit)}</p>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--foreground-muted)' }}>Spent: {formatCurrency(card.spent)}</span>
                <span style={{ color: 'var(--foreground)' }}>{formatCurrency(card.dailyLimit - card.spent)} left</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${Math.min((card.spent / card.dailyLimit) * 100, 100)}%`,
                    backgroundColor: 'var(--color-gold-400)'
                  }} 
                />
              </div>
            </div>
          </div>
          
          <button
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border text-sm font-semibold transition-colors duration-200 hover:bg-[var(--surface-elevated)]"
            style={{ backgroundColor: 'transparent', borderColor: 'var(--border-subtle)', color: 'var(--foreground)' }}
          >
            <Settings size={16} /> Advanced Settings
          </button>
        </div>
      </div>
    </motion.div>
  )
}
