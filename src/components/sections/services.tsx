'use client'

import { motion } from 'framer-motion'
import { Smartphone, Target, Zap, Check } from 'lucide-react'

const services = [
  {
    icon: Smartphone,
    title: 'Meta Ads Management',
    description: 'Maximize your reach on Facebook and Instagram with precision-targeted campaigns designed to convert.',
    features: [
      'Custom audience targeting',
      'A/B testing & optimization',
      'Creative development',
      'Performance analytics',
    ],
  },
  {
    icon: Target,
    title: 'Google Ads Strategy',
    description: 'Capture high-intent customers with optimized search, display, and shopping campaigns.',
    features: [
      'Keyword research & targeting',
      'Campaign structure optimization',
      'Conversion tracking setup',
      'ROI-focused bidding',
    ],
  },
  {
    icon: Zap,
    title: 'Lead Generation',
    description: 'Turn clicks into customers with proven lead generation funnels and nurture sequences.',
    features: [
      'Landing page optimization',
      'Lead magnet creation',
      'Email sequence setup',
      'CRM integration',
    ],
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-32 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-primary text-sm font-bold uppercase tracking-wider mb-4">
            What We Offer
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Services & Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tailored digital advertising strategies that connect your business with the right audience at the right time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group relative bg-card border border-primary/10 rounded-2xl p-8 transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{
                y: -15,
                scale: 1.05,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 12
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="font-display text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="inline-flex items-center text-primary font-semibold text-sm group-hover:gap-3 gap-2 transition-all"
                >
                  Get Started
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
