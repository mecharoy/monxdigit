import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Send, Plus, ArrowLeft, FileText, CheckSquare, Megaphone, MessageCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

const typeIcons: Record<string, React.ReactNode> = {
  DOCUMENT: <FileText className="w-4 h-4" />,
  TODO_LIST: <CheckSquare className="w-4 h-4" />,
  UPDATE: <Megaphone className="w-4 h-4" />,
  MESSAGE: <MessageCircle className="w-4 h-4" />,
}

const typeLabels: Record<string, string> = {
  DOCUMENT: 'Document',
  TODO_LIST: 'To-Do List',
  UPDATE: 'Update',
  MESSAGE: 'Message',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  REVIEWED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  ACKNOWLEDGED: 'bg-green-500/10 text-green-600 border-green-500/20',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  REVIEWED: 'Reviewed',
  ACKNOWLEDGED: 'Acknowledged',
}

export default async function SubmissionsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/login')

  const submissions = await prisma.submission.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-xl font-bold">
              <span className="text-purple-500">monx</span>
              <span className="text-foreground">digit</span>
              <span className="text-muted-foreground text-base ml-2">My Submissions</span>
            </h1>
          </div>
          <Link
            href="/dashboard/submit"
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Submission
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {submissions.length === 0 ? (
          <div className="text-center py-20">
            <Send className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">No submissions yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Send documents, updates, or messages to the admin team.
            </p>
            <Link
              href="/dashboard/submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> New Submission
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-card border border-primary/10 rounded-xl px-5 py-4 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-muted-foreground shrink-0">
                      {typeIcons[sub.type] ?? <FileText className="w-4 h-4" />}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground shrink-0">
                      {typeLabels[sub.type] ?? sub.type}
                    </span>
                    <span className="font-semibold truncate">{sub.title}</span>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                      statusColors[sub.status] ?? statusColors['PENDING']
                    }`}
                  >
                    {statusLabels[sub.status] ?? sub.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2 pl-6">{sub.content}</p>
                <p className="text-xs text-muted-foreground pl-6">{formatDate(sub.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
