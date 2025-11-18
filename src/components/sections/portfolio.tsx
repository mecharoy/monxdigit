'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { CreditCard, Home } from 'lucide-react'

const industries = [
  {
    icon: CreditCard,
    title: 'Credit Repair',
    description: 'Connecting credit repair experts with clients who need to rebuild their financial future.',
    image: '/images/credit-repair.png',
  },
  {
    icon: Home,
    title: 'Property Mortgage',
    description: 'Helping mortgage professionals find qualified buyers ready to secure their dream home.',
    image: '/images/mortgage.jpg',
  },
]

export function Portfolio() {
  return (
    <section id="portfolio" className="py-20 sm:py-32 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-primary text-sm font-bold uppercase tracking-wider mb-4">
            Our Work
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Industries We Serve
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Proven expertise across diverse sectors, delivering results that matter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              className="group bg-card border border-primary/10 rounded-2xl overflow-hidden text-center hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer"
              style={{ opacity: 0 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
              whileHover={{
                y: -15,
                scale: 1.08,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 12
                }
              }}
            >
              <div className="relative h-48 w-full bg-gradient-to-br from-primary/10 to-secondary/10">
                <Image
                  src={industry.image}
                  alt={industry.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              </div>
              <div className="p-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mb-6 group-hover:scale-110 transition-transform -mt-16 relative z-10 border-4 border-card">
                  <industry.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{industry.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{industry.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
