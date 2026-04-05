import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowUpRight, LogIn, UserPlus, Shield } from "lucide-react";
import { Link } from "react-router-dom";

/** GemmaVault Fintech Landing Page */

const Stat = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <div className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>{value}</div>
    <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>{label}</div>
  </div>
);

const SoftButton = ({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={
      "rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 " +
      className
    }
    style={{
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-foreground)',
    }}
    {...props}
  >
    {children}
  </button>
);

function MiniBars() {
  return (
    <div className="mt-6 flex h-36 items-end gap-4 rounded-xl p-4" style={{ backgroundColor: 'var(--surface)' }}>
      {[18, 48, 72, 96].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0.6 }}
          animate={{ height: h }}
          transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
          className="w-10 rounded-xl shadow-inner"
          style={{ background: 'linear-gradient(to top, var(--color-gold-300), var(--color-gold-500))' }}
        />
      ))}
    </div>
  );
}

function Planet() {
  return (
    <motion.svg
      initial={{ rotate: -8 }}
      animate={{ rotate: 0 }}
      transition={{ duration: 2, type: "spring" }}
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-300)" />
          <stop offset="100%" stopColor="var(--color-gold-600)" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="56" fill="url(#grad)" opacity="0.95" />
      <circle cx="94" cy="98" r="10" fill="white" opacity="0.45" />
      <circle cx="132" cy="126" r="8" fill="white" opacity="0.35" />
      <motion.ellipse
        cx="110" cy="110" rx="100" ry="34" stroke="white" strokeOpacity="0.6" fill="none"
        animate={{ strokeDashoffset: [200, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} strokeDasharray="200 200"
      />
      <motion.circle cx="210" cy="110" r="4" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.2, repeat: Infinity }} />
    </motion.svg>
  );
}

export default function MoneyflowLandingPage() {
  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: 'var(--background)' }}>
      {/* Top nav */}
      <nav className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-4 py-6 md:px-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg shadow h-9 w-9" style={{ background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))' }}>
            <Shield size={20} style={{ color: 'var(--color-charcoal-950)' }} />
          </div>
          <span className="font-sans text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>GemmaVault</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          {['Solutions','Product','Company'].map((item)=> (
            <Link key={item} to={`/${item.toLowerCase()}`} className="text-sm font-medium transition-colors hover:text-[var(--primary)]" style={{ color: 'var(--foreground-muted)' }}>{item}</Link>
          ))}
        </div>
        <div className="hidden gap-4 md:flex items-center">
          <Link to="/signup" className="text-sm font-semibold transition-colors hover:text-[var(--primary)]" style={{ color: 'var(--foreground)' }}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero area */}
      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 px-4 pb-14 mt-8 md:grid-cols-2 md:px-0 md:mt-12">
        {/* Left: headline */}
        <div className="flex flex-col justify-center space-y-8 pr-2">
          <div>
            <h1 className="text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>
              Secure your money
              <br />
              with precision.
            </h1>
            <p className="mt-4 max-w-md" style={{ color: 'var(--foreground-muted)' }}>
              Join over a million people who choose <span className="font-semibold text-gradient-gold">GemmaVault</span> for fast and secure future banking.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/signup">
              <SoftButton className="hover:opacity-90">
                Open Account <ArrowUpRight className="ml-1 inline h-4 w-4" />
              </SoftButton>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-2 md:max-w-sm">
            <Stat label="Total Currencies" value="140+" />
            <Stat label="Revenue Generated" value="$1.2B" />
          </div>

          <div className="mt-6 flex items-center gap-8 opacity-70">
            <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--foreground-muted)' }}>TRUSTED BY THE BEST</span>
            <div className="flex items-center gap-6" style={{ color: 'var(--foreground-secondary)' }}>
              <span className="font-semibold text-lg">loom</span>
              <span className="font-semibold text-lg">HubSpot</span>
              <span className="font-semibold text-lg">ramp</span>
            </div>
          </div>
        </div>

        {/* Right: animated card grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Secure card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative col-span-1 overflow-hidden rounded-xl p-6 shadow-lg"
            style={{ background: 'linear-gradient(to bottom, var(--color-charcoal-900), var(--color-charcoal-950))', color: 'var(--color-gold-50)' }}
          >
            <div className="absolute inset-0">
              <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="rg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--color-gold-400)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="400" height="400" fill="url(#rg)" />
                {[...Array(12)].map((_, i) => (
                  <circle key={i} cx="200" cy="200" r={20 + i * 14} fill="none" stroke="currentColor" strokeOpacity="0.12" />
                ))}
              </svg>
            </div>

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2 ring-1 ring-white/10" style={{ backgroundColor: 'var(--color-gold-600)', color: 'var(--color-charcoal-950)' }}>
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--color-gold-200)' }}>Extra Secure</span>
              </div>
              <div className="mt-8 text-xl font-medium leading-snug">
                Fraud and security
                <br /> keep your money safe
              </div>
              <motion.div
                className="absolute right-6 top-6 h-12 w-12 rounded-full"
                style={{ backgroundColor: 'var(--color-gold-500)', opacity: 0.3 }}
                animate={{ boxShadow: ["0 0 0 0 rgba(200,150,50,0.35)", "0 0 0 16px rgba(200,150,50,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Currencies card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative col-span-1 overflow-hidden rounded-xl p-6 shadow-lg"
            style={{ background: 'linear-gradient(to bottom, var(--color-gold-400), var(--color-gold-600))', color: 'var(--color-charcoal-950)' }}
          >
            <div className="pointer-events-none absolute -right-8 -top-10 opacity-90 mix-blend-overlay">
              <Planet />
            </div>
            <div className="relative mt-24 text-sm font-semibold opacity-90">Currencies</div>
            <div className="text-xl font-bold leading-snug">
              Hundreds of
              <br /> countries in one card
            </div>
          </motion.div>

          {/* Growth card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1 rounded-xl p-6 shadow-lg ring-1 ring-[var(--border-subtle)]"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Growth Revenue</div>
            <div className="mt-2 text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>$50,240 <span className="text-sm font-semibold align-middle" style={{ color: 'var(--foreground-muted)' }}>USD</span></div>
            <div className="mt-1 text-xs font-semibold" style={{ color: 'var(--success)' }}>↑ 0.024%</div>
            <MiniBars />
          </motion.div>

          <div className="hidden md:block" />
        </div>
      </div>

      {/* Features Grid */}
      <section className="mx-auto w-full max-w-[1180px] px-4 py-20 mt-12 md:px-0 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>Built for the future.</h2>
          <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--foreground-muted)' }}>Experience seamless automation, instant transfers, and top-tier compliance.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Instant Transfers", desc: "Move your money instantly anywhere in the world with no hidden fees." },
            { title: "Virtual Cards", desc: "Generate unlimited virtual cards for secure online subscriptions and spending." },
            { title: "AI Assistant", desc: "Chat with your AI to analyze your spending or schedule automatic payments." }
          ].map((feat, i) => (
            <div key={i} className="p-8 rounded-2xl shadow-sm transition-transform hover:-translate-y-1" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
              <div className="w-12 h-12 rounded-full mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                <Shield size={20} style={{ color: 'var(--color-gold-500)' }} />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>{feat.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-[1180px] px-4 pb-10 mt-12 text-center text-xs md:px-0" style={{ color: 'var(--foreground-muted)' }}>
        © {new Date().getFullYear()} GemmaVault, Inc. All rights reserved.
      </footer>
    </div>
  );
}
