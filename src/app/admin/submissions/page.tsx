import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { LogoutButton } from '@/components/admin/logout-button'
import { UpdateSubmissionStatus } from '@/components/admin/update-submission-status'
import { ArrowLeft } from 'lucide-react'

async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== 'authenticated') redirect('/admin/login')
}

export const dynamic = 'force-dynamic'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-600',
  REVIEWED: 'bg-blue-500/10 text-blue-600',
  ACKNOWLEDGED: 'bg-green-500/10 text-green-600',
}

const typeLabels: Record<string, string> = {
  DOCUMENT: 'Document',
  TODO_LIST: 'To-Do',
  UPDATE: 'Update',
  MESSAGE: 'Message',
}

export default async function AdminSubmissionsPage() {
  await checkAuth()

  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true, email: true } } },
  })

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'PENDING').length,
    reviewed: submissions.filter((s) => s.status === 'REVIEWED').length,
    acknowledged: submissions.filter((s) => s.status === 'ACKNOWLEDGED').length,
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-primary/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-card border border-primary/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="bg-card border border-primary/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-500">{stats.reviewed}</div>
            <div className="text-sm text-muted-foreground">Reviewed</div>
          </div>
          <div className="bg-card border border-primary/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-500">{stats.acknowledged}</div>
            <div className="text-sm text-muted-foreground">Acknowledged</div>
          </div>
        </div>

        {/* Submissions list */}
        <div className="space-y-4">
          {submissions.length === 0 && (
            <div className="bg-card border border-primary/10 rounded-lg px-6 py-12 text-center text-muted-foreground">
              No submissions yet.
            </div>
          )}
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-card border border-primary/10 rounded-xl overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-primary/10 bg-muted/30">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {typeLabels[sub.type] ?? sub.type}
                  </span>
                  <span className="font-semibold truncate">{sub.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">{sub.author.name} · {sub.author.email}</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(sub.createdAt)}</span>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[sub.status]}`}>
                    {sub.status.charAt(0) + sub.status.slice(1).toLowerCase()}
                  </span>
                  <UpdateSubmissionStatus submissionId={sub.id} currentStatus={sub.status} />
                </div>
              </div>
              <div className="px-5 py-4">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed max-h-64 overflow-y-auto">
                  {sub.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
