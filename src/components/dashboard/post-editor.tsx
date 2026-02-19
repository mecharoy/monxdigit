'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { renderMarkdownWithLatex } from '@/lib/markdown'
import {
  Bold,
  Italic,
  Code,
  Heading2,
  Image as ImageIcon,
  FunctionSquare,
  AlignJustify,
  Eye,
  Edit3,
  Save,
  Loader2,
} from 'lucide-react'

interface PostEditorProps {
  initialTitle?: string
  initialContent?: string
  initialPublished?: boolean
  postId?: string // if present, we're editing
}

export function PostEditor({
  initialTitle = '',
  initialContent = '',
  initialPublished = false,
  postId,
}: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [published, setPublished] = useState(initialPublished)
  const [mode, setMode] = useState<'write' | 'preview'>('write')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Insert text at cursor position
  const insertAtCursor = useCallback(
    (before: string, after = '', placeholder = '') => {
      const ta = textareaRef.current
      if (!ta) return
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const selected = content.slice(start, end) || placeholder
      const newContent =
        content.slice(0, start) + before + selected + after + content.slice(end)
      setContent(newContent)
      setTimeout(() => {
        ta.focus()
        const cursor = start + before.length + selected.length
        ta.setSelectionRange(cursor, cursor)
      }, 0)
    },
    [content]
  )

  const toolbar = [
    {
      icon: <Heading2 className="w-4 h-4" />,
      label: 'Heading',
      action: () => insertAtCursor('## ', '', 'Heading'),
    },
    {
      icon: <Bold className="w-4 h-4" />,
      label: 'Bold',
      action: () => insertAtCursor('**', '**', 'bold text'),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      label: 'Italic',
      action: () => insertAtCursor('_', '_', 'italic text'),
    },
    {
      icon: <Code className="w-4 h-4" />,
      label: 'Code',
      action: () => insertAtCursor('`', '`', 'code'),
    },
    {
      icon: <FunctionSquare className="w-4 h-4" />,
      label: 'Inline LaTeX',
      action: () => insertAtCursor('$', '$', 'x^2'),
    },
    {
      icon: <AlignJustify className="w-4 h-4" />,
      label: 'Block LaTeX',
      action: () => insertAtCursor('\n$$\n', '\n$$\n', 'E = mc^2'),
    },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      setError('Image must be under 3 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const ta = textareaRef.current
      if (!ta) return
      const start = ta.selectionStart
      const imgMd = `![${file.name}](${dataUrl})`
      setContent((prev) => prev.slice(0, start) + imgMd + prev.slice(start))
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSave = async () => {
    setError('')
    if (!title.trim()) { setError('Please add a title.'); return }
    if (!content.trim()) { setError('Please add some content.'); return }

    setSaving(true)
    try {
      const url = postId ? `/api/posts/${postId}` : '/api/posts'
      const method = postId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, published }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save post')
        return
      }
      router.push('/dashboard/posts')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title…"
        className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 font-display text-2xl font-bold placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-card border border-primary/10 rounded-xl px-3 py-2">
        {toolbar.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.label}
            onClick={btn.action}
            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            {btn.icon}
          </button>
        ))}

        {/* Image upload */}
        <label
          title="Upload image (max 3 MB)"
          className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ImageIcon className="w-4 h-4" />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>

        {/* Write / Preview toggle */}
        <div className="ml-auto flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('write')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              mode === 'write'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              mode === 'preview'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      {/* Editor / Preview pane */}
      {mode === 'write' ? (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Write your post in Markdown…\n\nInline math: $x^2 + y^2 = r^2$\nBlock math:\n$$\n\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}\n$$`}
          className="w-full min-h-[480px] bg-card border border-primary/10 rounded-xl px-4 py-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed"
        />
      ) : (
        <div
          className="w-full min-h-[480px] bg-card border border-primary/10 rounded-xl px-6 py-5 prose prose-sm dark:prose-invert max-w-none overflow-auto"
          dangerouslySetInnerHTML={{
            __html: content
              ? renderMarkdownWithLatex(content)
              : '<p class="text-muted-foreground">Nothing to preview yet.</p>',
          }}
        />
      )}

      {/* Bottom bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors" />
            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <span className="text-sm font-medium">
            {published ? 'Published (visible on blog)' : 'Draft (private)'}
          </span>
        </label>

        <div className="flex items-center gap-3">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : postId ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  )
}
