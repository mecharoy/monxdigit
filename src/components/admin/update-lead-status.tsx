'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateLeadStatus } from '@/app/actions/admin'
import type { LeadStatus } from '@prisma/client'

const statusColors: Record<LeadStatus, string> = {
  NEW: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  CONTACTED: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  QUALIFIED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  CONVERTED: 'bg-green-500/10 text-green-500 border-green-500/20',
  ARCHIVED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

const statuses: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'ARCHIVED']

interface UpdateLeadStatusProps {
  leadId: string
  currentStatus: LeadStatus
}

export function UpdateLeadStatus({ leadId, currentStatus }: UpdateLeadStatusProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  async function handleStatusChange(newStatus: LeadStatus) {
    await updateLeadStatus(leadId, newStatus)
    setIsOpen(false)
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[currentStatus]}`}
      >
        {currentStatus}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-40 bg-card border border-primary/10 rounded-lg shadow-lg overflow-hidden">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
