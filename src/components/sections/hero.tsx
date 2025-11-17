'use client'

import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-8 animate-float">
            <Rocket className="w-4 h-4" />
            Performance-Driven Marketing
          </div>
        </motion.div>

        <motion.h1
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {'Helping Niche '.split('').map((char, index) => (
            <motion.span
              key={`char-${index}`}
              className="inline-block"
              whileHover={{
                y: -15,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 10
                }
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            {'Find Their Audience'.split('').map((char, index) => (
              <motion.span
                key={`gradient-char-${index}`}
                className="inline-block"
                whileHover={{
                  y: -15,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 10
                  }
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Expert Meta & Google Ads management for small businesses and e-commerce brands.
          Data-driven campaigns that generate real leads and measurable ROI.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent/80 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:shadow-xl hover:shadow-accent/50 hover:-translate-y-1"
          >
            Start Growing Today
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center rounded-full border-2 border-primary px-8 py-4 text-base font-semibold text-primary transition-all hover:bg-primary/10 hover:-translate-y-1"
          >
            Explore Services
          </a>
        </motion.div>
      </div>
    </section>
  )
}
