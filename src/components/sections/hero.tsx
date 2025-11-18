'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Rocket } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-8 animate-float">
            <Rocket className="w-4 h-4" />
            Helping Niche Find their Audience
          </div>
        </motion.div>

        <motion.h1
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {'Credit Repair & '.split(' ').map((word, wordIndex) => (
            <span key={`word-${wordIndex}`} className="inline-flex">
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={`char-${wordIndex}-${charIndex}`}
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
                  {char}
                </motion.span>
              ))}
              {wordIndex < 'Credit Repair & '.split(' ').length - 1 && '\u00A0'}
            </span>
          ))}
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            {'Mortgage Leads'.split(' ').map((word, wordIndex) => (
              <span key={`gradient-word-${wordIndex}`} className="inline-flex">
                {word.split('').map((char, charIndex) => (
                  <motion.span
                    key={`gradient-char-${wordIndex}-${charIndex}`}
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
                    {char}
                  </motion.span>
                ))}
                {wordIndex < 'Mortgage Leads'.split(' ').length - 1 && '\u00A0'}
              </span>
            ))}
          </span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Connecting credit repair specialists and mortgage professionals with qualified clients ready to rebuild their credit or buy their dream home. We handle lead generation, qualification, and appointment booking—you focus on closing deals.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-1"
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

          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full aspect-square max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl transform rotate-6"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border-4 border-card">
                <Image
                  src="/images/handshaking-deal.jpg"
                  alt="Professional Partnership"
                  width={800}
                  height={800}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
