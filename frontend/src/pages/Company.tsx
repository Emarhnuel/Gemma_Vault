import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ArrowRight } from "lucide-react";

export default function Company() {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--background)' }}>
      <nav className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-4 py-6 md:px-0">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center rounded-lg shadow h-9 w-9" style={{ background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))' }}>
            <Shield size={20} style={{ color: 'var(--color-charcoal-950)' }} />
          </div>
          <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>GemmaVault</span>
        </Link>
        <div className="hidden gap-4 md:flex items-center">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-[var(--primary)]" style={{ color: 'var(--foreground-muted)' }}>Back to Home</Link>
        </div>
      </nav>

      <main className="mx-auto max-w-[1180px] px-4 py-20 md:px-0 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h1 className="text-5xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>About GemmaVault</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)' }}>
            We're on a mission to redefine modern banking with transparency, security, and world-class technology.
          </p>
          <div className="pt-8">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              Open Account <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
