'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'Who is this for?',
    answer: 'Our services are specifically designed for credit repair specialists and mortgage professionals who want to scale their business with a consistent flow of qualified clients. If you\'re tired of inconsistent lead flow, spending hours on unqualified prospects, or struggling to fill your calendar with serious buyers, we\'re here to help. Whether you\'re a solo practitioner or a growing agency, our targeted approach ensures you connect with clients who are ready to take action—whether that\'s rebuilding their credit or securing their dream home. Don\'t worry, you would be in the right hands '
  },
  {
    question: 'What do we promise?',
    answer: 'Monxdigit promises qualified, ready-to-convert leads that match your ideal client profile. Our data-driven approach focuses on attracting individuals who are actively seeking credit repair or mortgage solutions, rather than just clicks or impressions. You\'ll receive pre-qualified prospects who have been vetted based on their financial situation and intent. We handle the heavy lifting—from ad creation and targeting to lead qualification and appointment booking—so you can focus on what you do best: closing deals. Our commitment is simple: measurable ROI, transparent reporting, and a partnership focused on your long-term success.'
  },
  {
    question: 'What should you expect?',
    answer: 'Expect a streamlined process that takes the guesswork out of client acquisition. After our initial consultation, we\'ll create targeted Meta and Google Ads campaigns designed to attract your ideal clients. You\'ll receive a steady stream of pre-qualified leads delivered directly to your inbox or CRM. Our team handles appointment scheduling, so your calendar fills up with consultations—not cold calls. You can expect detailed monthly reports showing exactly where your leads are coming from, conversion rates, and ROI. Most importantly, expect more time to focus on serving clients rather than chasing them, with the peace of mind that comes from a predictable, scalable lead generation system.'
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 sm:py-32 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-primary text-sm font-bold uppercase tracking-wider mb-4">
            FAQ
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about partnering with us.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-card border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg dark:shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 sm:px-8 py-6 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
              >
                <h3 className="font-display text-lg sm:text-xl font-bold pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 sm:px-8 pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
