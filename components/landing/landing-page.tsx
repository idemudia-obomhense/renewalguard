'use client'

import { useEffect, useState } from 'react'
import { Nav } from '@/components/landing/nav'
import { Hero } from '@/components/landing/hero'
import { TrustBar } from '@/components/landing/trust-bar'
import { ProblemSection } from '@/components/landing/problem-section'
import { SolutionSection } from '@/components/landing/solution-section'
import { DashboardShowcase } from '@/components/landing/dashboard-showcase'
import { HowItWorks } from '@/components/landing/how-it-works'
import { PricingSection } from '@/components/landing/pricing-section'
import { FaqSection } from '@/components/landing/faq-section'
import { FinalCta } from '@/components/landing/final-cta'
import { Footer } from '@/components/landing/footer'

const THEME_STORAGE_KEY = 'landing-theme'

export function LandingPage() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // One-time sync from localStorage on mount (client-only external system) —
    // not a cascading-render case the rule is meant to catch.
    if (window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(true)
    }
  }, [])

  function toggleTheme() {
    setIsDark(prev => {
      const next = !prev
      window.localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        <Nav isDark={isDark} onToggleTheme={toggleTheme} />
        <Hero />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <DashboardShowcase />
        <HowItWorks />
        <PricingSection />
        <FaqSection />
        <FinalCta />
        <Footer />
      </div>
    </div>
  )
}
