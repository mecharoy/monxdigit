import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { LogoutButton } from '@/components/admin/logout-button'
import { ArrowLeft, Folder } from 'lucide-react'

async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!auth || auth.value !== 'authenticated') redirect('/admin/login')
}

export const dynamic = 'force-dynamic'

export default async function AdminSubmissionsIndexPage() {
  await checkAuth()

  const [pending, reviewed, acknowledged] = await Promise.all([
    prisma.submission.count({ where: { status: 'PENDING' } }),
    prisma.submission.count({ where: { status: 'REVIEWED' } }),
    prisma.submission.count({ where: { status: 'ACKNOWLEDGED' } }),
  ])

  const folders = [
    {
      href: '/admin/submissions/pending',
      label: 'Pending',
      count: pending,
      dotColor: 'bg-yellow-500',
      badgeClass: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      desc: 'Awaiting review',
    },
    {
      href: '/admin/submissions/reviewed',
      label: 'Reviewed',
      count: reviewed,
      dotColor: 'bg-blue-500',
      badgeClass: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      desc: 'Reviewed by admin',
    },
    {
      href: '/admin/submissions/acknowledged',
      label: 'Acknowledged',
      count: acknowledged,
      dotColor: 'bg-green-500',
      badgeClass: 'bg-green-500/10 text-green-600 border-green-500/20',
      desc: 'Completed & acknowledged',
    },
  ]

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

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <p className="text-sm text-muted-foreground mb-6">
          {pending + reviewed + acknowledged} total submissions — select a folder to view
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {folders.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group flex flex-col gap-3 bg-card border border-primary/10 hover:border-primary/30 rounded-2xl px-6 py-6 transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${f.dotColor}`} />
                  <Folder className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${f.badgeClass}`}>
                  {f.count}
                </span>
              </div>
              <div>
                <div className="font-semibold text-base">{f.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{f.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
