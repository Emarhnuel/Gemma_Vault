import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { generateId, formatCurrency } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import type { ChatAction } from '@/data/types'

const quickActions = [
  'Check my balance',
  'Show recent transactions',
  'Send £50 to John',
  'Pay light bill',
]

export default function ChatPanel() {
  const chatOpen = useAppStore((s) => s.chatOpen)
  const setChatOpen = useAppStore((s) => s.setChatOpen)
  const messages = useAppStore((s) => s.chatMessages)
  const addMessage = useAppStore((s) => s.addChatMessage)
  const updateMessage = useAppStore((s) => s.updateChatMessage)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [chatOpen])

  const handleSend = () => {
    if (!input.trim()) return

    const userText = input.trim()
    addMessage({
      id: generateId('msg'),
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    })
    setInput('')
    setIsTyping(true)

    // Demo Agent Logic
    setTimeout(() => {
      let responseContent = 'I\u2019m processing your request\u2026 This is a demo response. Once connected to the Deep Agents backend, I\u2019ll provide real-time banking intelligence powered by Gemma 4.'
      let action: ChatAction | undefined

      if (userText.toLowerCase().includes('send')) {
        responseContent = 'I can help you send money. Please review the transaction details below and confirm to proceed.'
        action = {
          type: 'transfer_confirm',
          status: 'pending',
          data: {
            amount: 50,
            recipient: 'John Doe',
            account: '12345678',
            sortCode: '20-45-67'
          }
        }
      } else if (userText.toLowerCase().includes('bill')) {
        responseContent = 'You are about to pay your Light Bill. Please confirm.'
        action = {
           type: 'bill_confirm',
           status: 'pending',
           data: {
             provider: 'British Gas',
             amount: 120.50,
             dueDate: '25th Oct'
           }
        }
      } else if (userText.toLowerCase().includes('balance')) {
        responseContent = `Your current balance is £24,850.73. Is there anything else you'd like to do?`
      }

      addMessage({
        id: generateId('msg'),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        action
      })
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    setTimeout(() => handleSend(), 100)
  }

  const handleActionConfirm = (msgId: string, actionData: ChatAction) => {
    updateMessage(msgId, { 
      action: { type: actionData.type, data: actionData.data, status: 'confirmed' } 
    })
    
    // Simulate execution step
    setTimeout(() => {
      addMessage({
        id: generateId('msg'),
        role: 'assistant',
        content: `Successfully completed: ${actionData.type === 'transfer_confirm' ? 'Money Transfer' : 'Bill Payment'}. The transaction has been recorded.`,
        timestamp: new Date().toISOString(),
      })
    }, 1000)
  }

  const handleActionReject = (msgId: string, actionData: ChatAction) => {
    updateMessage(msgId, { 
      action: { type: actionData.type, data: actionData.data, status: 'rejected' } 
    })
    
    addMessage({
      id: generateId('msg'),
      role: 'assistant',
      content: 'I have cancelled the operation. Let me know if you need anything else.',
      timestamp: new Date().toISOString(),
    })
  }

  const renderActionCard = (msgId: string, action: ChatAction) => {
    return (
      <div className="mt-3 rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} style={{ color: 'var(--warning)' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>
              {action.type === 'transfer_confirm' ? 'Transfer Approval' : 'Bill Payment Approval'}
            </span>
          </div>
          {action.status === 'confirmed' && <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />}
          {action.status === 'rejected' && <X size={16} style={{ color: 'var(--danger)' }} />}
        </div>
        
        <div className="p-4 space-y-3">
          {action.type === 'transfer_confirm' && (
             <>
               <div className="flex justify-between text-sm">
                 <span style={{ color: 'var(--foreground-muted)' }}>Amount</span>
                 <span className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                   {formatCurrency(action.data.amount as number)}
                 </span>
               </div>
               <div className="flex justify-between text-sm">
                 <span style={{ color: 'var(--foreground-muted)' }}>Recipient</span>
                 <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                   {action.data.recipient as string}
                 </span>
               </div>
               <div className="flex justify-between text-xs">
                 <span style={{ color: 'var(--foreground-muted)' }}>Account</span>
                 <span className="font-mono text-right" style={{ color: 'var(--foreground)' }}>
                   {(action.data.sortCode as string)}<br/>
                   {(action.data.account as string)}
                 </span>
               </div>
             </>
          )}

          {action.type === 'bill_confirm' && (
             <>
               <div className="flex justify-between text-sm">
                 <span style={{ color: 'var(--foreground-muted)' }}>Bill Provider</span>
                 <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                   {action.data.provider as string}
                 </span>
               </div>
               <div className="flex justify-between text-sm">
                 <span style={{ color: 'var(--foreground-muted)' }}>Amount</span>
                 <span className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                   {formatCurrency(action.data.amount as number)}
                 </span>
               </div>
             </>
          )}
        </div>

        {action.status === 'pending' ? (
          <div className="grid grid-cols-2 gap-px border-t" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--border-subtle)' }}>
             <button 
               onClick={() => handleActionReject(msgId, action)}
               className="py-3 text-sm font-medium transition-colors hover:bg-[var(--surface-elevated)]"
               style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}
             >
               Cancel
             </button>
             <button 
               onClick={() => handleActionConfirm(msgId, action)}
               className="py-3 text-sm font-bold transition-colors"
               style={{ backgroundColor: 'var(--success)', color: 'var(--color-charcoal-950)' }}
             >
               Approve
             </button>
          </div>
        ) : (
          <div className="px-4 py-3 border-t text-center text-xs font-medium uppercase tracking-wider" 
               style={{ 
                 borderColor: 'var(--border-subtle)', 
                 backgroundColor: 'var(--surface-elevated)',
                 color: action.status === 'confirmed' ? 'var(--success)' : 'var(--danger)'
               }}>
            {action.status}
          </div>
        )}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {chatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:pointer-events-none"
            onClick={() => setChatOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full md:w-[420px] border-l shadow-2xl"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border-subtle)',
              overscrollBehavior: 'contain',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat header */}
            <div
              className="flex items-center justify-between px-5 border-b flex-shrink-0"
              style={{
                height: 'var(--header-height)',
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--background)' // contrast
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))',
                  }}
                >
                  <Sparkles size={18} style={{ color: 'var(--color-charcoal-950)' }} />
                </div>
                <div>
                  <h2
                    className="text-sm font-bold tracking-wide"
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}
                  >
                    GEMMA<span style={{ color: 'var(--foreground-muted)' }}>VAULT</span>
                  </h2>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-0.5" style={{ color: 'var(--color-gold-500)' }}>
                    AI Agent
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 hover:bg-[var(--surface-elevated)]"
                style={{ color: 'var(--foreground-muted)' }}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <div
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-[85%] px-4 py-3 text-[13px] leading-relaxed relative"
                      style={
                        msg.role === 'user'
                          ? {
                              background: 'linear-gradient(135deg, var(--color-gold-500), var(--color-gold-600))',
                              color: 'var(--color-charcoal-950)',
                              borderRadius: '16px 16px 0 16px',
                            }
                          : {
                              backgroundColor: 'var(--surface-elevated)',
                              color: 'var(--foreground)',
                              borderRadius: '16px 16px 16px 0',
                            }
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                  {msg.action && renderActionCard(msg.id, msg.action)}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-4 rounded-2xl"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      borderBottomLeftRadius: '0.375rem',
                    }}
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-gold-400)',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                            animationDelay: `${i * 0.16}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick actions (show only at start) */}
              {messages.length <= 1 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: 'var(--foreground-muted)' }}>
                    Quick actions
                  </p>
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm text-left transition-colors duration-200 hover:bg-[var(--surface-elevated)] border"
                      style={{
                         backgroundColor: 'var(--surface-elevated)',
                         color: 'var(--foreground-secondary)',
                         borderColor: 'var(--border-subtle)',
                      }}
                    >
                      <span>{action}</span>
                      <ArrowRight size={14} style={{ color: 'var(--primary)' }} />
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="flex-shrink-0 p-4 border-t bg-[var(--background)]"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-3 relative"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about your finances\u2026"
                  className="flex-1 h-12 pl-4 pr-12 rounded-xl text-sm border outline-none placeholder:text-[var(--foreground-muted)] transition-colors focus:border-[var(--color-gold-500)]"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--foreground)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:scale-95 hover:scale-105 active:scale-95"
                  style={{
                    background: input.trim()
                      ? 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))'
                      : 'transparent',
                    color: input.trim() ? 'var(--color-charcoal-950)' : 'var(--foreground-muted)',
                  }}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
