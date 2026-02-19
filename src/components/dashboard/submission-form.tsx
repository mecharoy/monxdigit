'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckSquare, Megaphone, MessageCircle, Send, Loader2 } from 'lucide-react'

const TYPES = [
  { value: 'DOCUMENT', label: 'Document', icon: <FileText className="w-4 h-4" />, desc: 'Formal document or report' },
  { value: 'TODO_LIST', label: 'To-Do List', icon: <CheckSquare className="w-4 h-4" />, desc: 'Tasks and action items' },
  { value: 'UPDATE', label: 'Update', icon: <Megaphone className="w-4 h-4" />, desc: 'Progress or status update' },
  { value: 'MESSAGE', label: 'Message', icon: <MessageCircle className="w-4 h-4" />, desc: 'General message or note' },
]

export function SubmissionForm() {
  const router = useRouter()
  const [type, setType] = useState('MESSAGE')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError('Please add a title.'); return }
    if (!content.trim()) { setError('Please write some content.'); return }

    setSending(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, content }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send submission')
        return
      }
      router.push('/dashboard/submissions')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all text-sm ${
                type === t.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-primary/10 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {t.icon}
              <span className="font-medium">{t.label}</span>
              <span className="text-xs opacity-70 hidden sm:block">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="sub-title">
          Title
        </label>
        <input
          id="sub-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief title for this submission…"
          className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="sub-content">
          Content
        </label>
        <textarea
          id="sub-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === 'TODO_LIST'
              ? '- [ ] Task one\n- [ ] Task two\n- [ ] Task three'
              : 'Write your content here…'
          }
          rows={12}
          className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed font-mono"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Markdown supported. For To-Do lists, use <code className="bg-muted px-1 rounded">- [ ] task</code> syntax.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={sending}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? 'Sending…' : 'Send Submission'}
        </button>
      </div>
    </form>
  )
}
