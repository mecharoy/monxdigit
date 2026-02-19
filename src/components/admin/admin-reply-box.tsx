'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'

interface AdminReplyBoxProps {
  submissionId: string
  initialReply?: string | null
}

export function AdminReplyBox({ submissionId, initialReply }: AdminReplyBoxProps) {
  const [reply, setReply] = useState(initialReply ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminReply: reply }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save reply')
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-3 border-t border-primary/10 pt-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
        Admin Reply
      </p>
      <div className="flex gap-2">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a reply visible to the user…"
          rows={2}
          className="flex-1 bg-background border border-primary/20 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          title="Send reply"
          className="shrink-0 self-start flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          {saved ? 'Saved' : 'Send'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
