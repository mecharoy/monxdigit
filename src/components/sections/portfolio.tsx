'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Briefcase, Home } from 'lucide-react'

const industries = [
  {
    icon: ShoppingBag,
    title: 'E-Commerce',
    description: 'Scaling online stores with ROAS-focused campaigns that drive sales and customer acquisition.',
  },
  {
    icon: Briefcase,
    title: 'B2B Services',
    description: 'Generating qualified leads for professional services through strategic targeting.',
  },
  {
    icon: Home,
    title: 'Local Businesses',
    description: 'Connecting neighborhood businesses with their local community through geo-targeted ads.',
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              className="group bg-card border border-primary/10 rounded-2xl p-8 text-center hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
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
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <industry.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">{industry.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{industry.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
