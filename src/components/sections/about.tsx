'use client'

import { motion } from 'framer-motion'
import { Target, Megaphone, UserCheck, Calendar } from 'lucide-react'

const features = [
  { icon: Target, title: 'Market Understanding', description: 'We analyze your ideal customer profile and target the right audience.' },
  { icon: Megaphone, title: 'High-Impact Ads', description: 'We design and run effective ad campaigns to attract qualified leads.' },
  { icon: UserCheck, title: 'Lead Qualification', description: 'Only the most promising prospects get through—no wasted time.' },
  { icon: Calendar, title: 'Appointment Booking', description: 'We handle call scheduling, so you only meet ready-to-talk clients.' },
]

export function About() {
  return (
    <section id="about" className="py-20 sm:py-32 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="text-primary text-sm font-bold uppercase tracking-wider mb-4">
              Why Choose Us?
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-6">
              Your Partner in Client Acquisition
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We know it's challenging for credit repair specialists and mortgage professionals to consistently find qualified clients. That's where we step in.
              </p>
              <p>
                Whether you're helping clients rebuild their credit or securing their dream home, we bring you ready-to-convert prospects. Our targeted approach ensures you spend less time chasing leads and more time closing deals.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-card border border-primary/10 rounded-xl p-6 hover:border-primary hover:-translate-y-1 transition-all"
                style={{ opacity: 0 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
              >
                <feature.icon className="w-10 h-10 text-primary mb-3" />
                <h4 className="font-display text-lg font-bold mb-2 text-primary">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
