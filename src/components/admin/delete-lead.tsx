'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteLead } from '@/app/actions/admin'

interface DeleteLeadProps {
  leadId: string
}

export function DeleteLead({ leadId }: DeleteLeadProps) {
  const router = useRouter()

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(leadId)
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-destructive hover:text-destructive/80 transition-colors"
      title="Delete lead"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
