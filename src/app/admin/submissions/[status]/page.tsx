import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { LogoutButton } from '@/components/admin/logout-button'
import { UpdateSubmissionStatus } from '@/components/admin/update-submission-status'
import { SubmissionThread } from '@/components/submission-thread'
import { TodoChecklist } from '@/components/todo-checklist'
import { ArrowLeft, Paperclip } from 'lucide-react'
import { UserFilter } from '@/components/admin/user-filter'

async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== 'authenticated') redirect('/admin/login')
}

export const dynamic = 'force-dynamic'

const STATUS_MAP = {
  pending: { db: 'PENDING' as const, label: 'Pending', dotColor: 'bg-yellow-500', badgeClass: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  reviewed: { db: 'REVIEWED' as const, label: 'Reviewed', dotColor: 'bg-blue-500', badgeClass: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  acknowledged: { db: 'ACKNOWLEDGED' as const, label: 'Acknowledged', dotColor: 'bg-green-500', badgeClass: 'bg-green-500/10 text-green-600 border-green-500/20' },
}

const typeLabels: Record<string, string> = {
  DOCUMENT: 'Document',
  TODO_LIST: 'To-Do',
  UPDATE: 'Update',
  MESSAGE: 'Message',
}


const USER_COLORS = [
  { bg: 'bg-violet-500/15', text: 'text-violet-600', border: 'border-violet-500/30' },
  { bg: 'bg-sky-500/15',    text: 'text-sky-600',    border: 'border-sky-500/30' },
  { bg: 'bg-emerald-500/15',text: 'text-emerald-600',border: 'border-emerald-500/30' },
  { bg: 'bg-rose-500/15',   text: 'text-rose-600',   border: 'border-rose-500/30' },
  { bg: 'bg-amber-500/15',  text: 'text-amber-600',  border: 'border-amber-500/30' },
  { bg: 'bg-pink-500/15',   text: 'text-pink-600',   border: 'border-pink-500/30' },
  { bg: 'bg-teal-500/15',   text: 'text-teal-600',   border: 'border-teal-500/30' },
  { bg: 'bg-orange-500/15', text: 'text-orange-600', border: 'border-orange-500/30' },
]

function getUserColor(email: string) {
  let hash = 0
  for (let i = 0; i < email.length; i++) hash = (hash * 31 + email.charCodeAt(i)) >>> 0
  return USER_COLORS[hash % USER_COLORS.length]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

type Submission = Awaited<ReturnType<typeof fetchSubmissions>>[number]

async function fetchSubmissions(status: 'PENDING' | 'REVIEWED' | 'ACKNOWLEDGED', authorId?: string) {
  try {
    return await prisma.submission.findMany({
      where: { status, ...(authorId ? { authorId } : {}) },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } },
        todoItems: { orderBy: { order: 'asc' } },
        fileAttachment: { select: { id: true, fileName: true } },
      },
    })
  } catch {
    return []
  }
}

async function fetchUsersWithSubmissions(status: 'PENDING' | 'REVIEWED' | 'ACKNOWLEDGED') {
  try {
    const rows = await prisma.submission.findMany({
      where: { status },
      select: { author: { select: { id: true, name: true, email: true } } },
      distinct: ['authorId'],
      orderBy: { author: { name: 'asc' } },
    })
    return rows.map((r) => r.author)
  } catch {
    return []
  }
}

function AttachmentDownload({ submissionId, fileName }: { submissionId: string; fileName: string }) {
  return (
    <div className="mt-3">
      <a
        href={`/api/admin/submissions/${submissionId}/download`}
        className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-colors"
      >
        <Paperclip className="w-3.5 h-3.5" />
        Download {fileName}
      </a>
    </div>
  )
}

function SubmissionCard({ sub }: { sub: Submission }) {
  const color = getUserColor(sub.author.email)
  const initials = getInitials(sub.author.name)
  return (
    <div className={`bg-card border rounded-xl overflow-hidden ${color.border}`}>
      {/* Author banner */}
      <div className={`flex items-center justify-between gap-3 px-5 py-2.5 ${color.bg}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${color.bg} ${color.text} ${color.border}`}>
            {initials}
          </span>
          <div className="min-w-0">
            <p className={`text-sm font-bold leading-tight truncate ${color.text}`}>{sub.author.name}</p>
            <p className="text-xs text-muted-foreground truncate">{sub.author.email}</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{formatDateTime(sub.createdAt)}</span>
      </div>
      {/* Submission header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-primary/10 bg-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {typeLabels[sub.type] ?? sub.type}
          </span>
          <span className="font-semibold truncate">{sub.title}</span>
        </div>
        <UpdateSubmissionStatus submissionId={sub.id} currentStatus={sub.status} />
      </div>
      <div className="px-5 py-4">
        {sub.type !== 'TODO_LIST' && sub.content?.trim() && (
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed max-h-48 overflow-y-auto">
            {sub.content}
          </pre>
        )}

        {sub.type === 'DOCUMENT' && sub.fileAttachment && (
          <AttachmentDownload submissionId={sub.id} fileName={sub.fileAttachment.fileName} />
        )}

        {sub.type === 'TODO_LIST' && (
          <TodoChecklist
            submissionId={sub.id}
            isAdmin={true}
            initialTodos={sub.todoItems}
            threadClosed={sub.threadClosed}
          />
        )}

        <SubmissionThread
          submissionId={sub.id}
          isAdmin={true}
          initialMessages={sub.messages}
          initialThreadClosed={sub.threadClosed}
        />
      </div>
    </div>
  )
}

export default async function AdminSubmissionsByStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ status: string }>
  searchParams: Promise<{ userId?: string }>
}) {
  await checkAuth()

  const { status } = await params
  const { userId } = await searchParams
  const meta = STATUS_MAP[status as keyof typeof STATUS_MAP]
  if (!meta) notFound()

  const [submissions, users] = await Promise.all([
    fetchSubmissions(meta.db, userId),
    fetchUsersWithSubmissions(meta.db),
  ])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/submissions" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-2xl font-bold">
              <span className="text-purple-500">monx</span>
              <span className="text-foreground">digit</span>
              <span className="text-muted-foreground text-lg ml-2">Submissions</span>
            </h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${meta.dotColor} shrink-0`} />
            <h2 className="font-semibold text-lg">{meta.label}</h2>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${meta.badgeClass}`}>
              {submissions.length}
            </span>
          </div>
          {users.length > 1 && (
            <UserFilter users={users} selectedUserId={userId} />
          )}
        </div>

        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No {meta.label.toLowerCase()} submissions.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => <SubmissionCard key={sub.id} sub={sub} />)}
          </div>
        )}
      </main>
    </div>
  )
}
