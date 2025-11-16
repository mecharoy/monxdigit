'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { LeadStatus } from '@prisma/client'

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error updating lead status:', error)
    return { success: false }
  }
}

export async function deleteLead(leadId: string) {
  try {
    await prisma.lead.delete({
      where: { id: leadId },
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error deleting lead:', error)
    return { success: false }
  }
}
