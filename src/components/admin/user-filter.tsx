'use client'

import { useRouter, usePathname } from 'next/navigation'

interface UserOption {
  id: string
  name: string
  email: string
}

interface UserFilterProps {
  users: UserOption[]
  selectedUserId?: string
}

export function UserFilter({ users, selectedUserId }: UserFilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    if (value) {
      router.push(`${pathname}?userId=${value}`)
    } else {
      router.push(pathname)
    }
  }

  return (
    <select
      value={selectedUserId ?? ''}
      onChange={handleChange}
      className="h-8 rounded-lg border border-primary/20 bg-card px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
    >
      <option value="">All users</option>
      {users.map((u) => (
        <option key={u.id} value={u.id}>
          {u.name} ({u.email})
        </option>
      ))}
    </select>
  )
}
