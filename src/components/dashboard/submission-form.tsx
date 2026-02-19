'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckSquare, Megaphone, MessageCircle, Send, Loader2, Plus, X } from 'lucide-react'

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
  const [todoItems, setTodoItems] = useState<string[]>([])
  const [todoInput, setTodoInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const addTodoItem = () => {
    const text = todoInput.trim()
    if (!text) return
    setTodoItems((prev) => [...prev, text])
    setTodoInput('')
  }

  const removeTodoItem = (index: number) => {
    setTodoItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTodoItem()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError('Please add a title.'); return }

    if (type === 'TODO_LIST') {
      if (todoItems.length === 0) { setError('Please add at least one to-do item.'); return }
    } else {
      if (!content.trim()) { setError('Please write some content.'); return }
    }

    setSending(true)
    try {
      const body =
        type === 'TODO_LIST'
          ? { title, type, content: todoItems.join('\n'), items: todoItems }
          : { title, type, content }

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

      {/* Content — text area for non-todo, item builder for todo */}
      {type === 'TODO_LIST' ? (
        <div>
          <label className="block text-sm font-medium mb-1.5">To-Do Items</label>

          {/* Existing items */}
          {todoItems.length > 0 && (
            <ul className="space-y-1.5 mb-3">
              {todoItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2 bg-card border border-primary/10 rounded-lg px-3 py-2">
                  <span className="w-4 h-4 rounded border border-primary/30 shrink-0 bg-background" />
                  <span className="text-sm flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeTodoItem(i)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Add item input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={handleTodoKeyDown}
              placeholder="Add a task… (Enter to add)"
              className="flex-1 bg-card border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={addTodoItem}
              disabled={!todoInput.trim()}
              className="flex items-center gap-1.5 bg-muted border border-primary/20 text-foreground text-sm font-medium px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          {todoItems.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1.5">Add at least one item to your to-do list.</p>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="sub-content">
            Content
          </label>
          <textarea
            id="sub-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here…"
            rows={12}
            className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed"
          />
        </div>
      )}

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
