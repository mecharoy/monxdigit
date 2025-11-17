'use client'

import { motion } from 'framer-motion'
import { BarChart3, Palette, RefreshCcw, FileText } from 'lucide-react'

const features = [
  { icon: BarChart3, title: 'Data-Driven', description: 'Every decision backed by analytics and performance metrics' },
  { icon: Palette, title: 'Creative Excellence', description: 'Compelling ad creatives that stop the scroll and drive action' },
  { icon: RefreshCcw, title: 'Continuous Optimization', description: 'Constant testing and refinement for maximum ROI' },
  { icon: FileText, title: 'Transparent Reporting', description: 'Clear insights into campaign performance and spending' },
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
              Why Choose monxdigit
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-6">
              Your Growth Partner in Digital Advertising
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We're not just another marketing agency. We're performance specialists who understand
                that every dollar you invest needs to work harder for your business.
              </p>
              <p>
                Our approach combines data-driven strategy with creative excellence to deliver campaigns
                that don't just look good—they perform exceptionally.
              </p>
              <p>
                Whether you're a small business looking to scale or an e-commerce brand aiming to dominate
                your niche, we build custom strategies that align with your goals and budget.
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
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
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
