'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type SubmissionStatus = 'PENDING' | 'REVIEWED' | 'ACKNOWLEDGED'

const statusColors: Record<SubmissionStatus, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  REVIEWED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  ACKNOWLEDGED: 'bg-green-500/10 text-green-600 border-green-500/20',
}

const statuses: SubmissionStatus[] = ['PENDING', 'REVIEWED', 'ACKNOWLEDGED']

export function UpdateSubmissionStatus({
  submissionId,
  currentStatus,
}: {
  submissionId: string
  currentStatus: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  async function handleChange(newStatus: SubmissionStatus) {
    await fetch(`/api/admin/submissions/${submissionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setIsOpen(false)
    router.refresh()
  }

  const current = (currentStatus as SubmissionStatus) ?? 'PENDING'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[current]}`}
      >
        {current}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-44 bg-card border border-primary/10 rounded-lg shadow-lg overflow-hidden">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => handleChange(status)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
              >
                {status}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
