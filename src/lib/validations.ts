import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  business: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const leadStatusSchema = z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'ARCHIVED'])
