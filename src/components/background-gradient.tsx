'use client'

import { useTheme } from './theme-provider'

export function BackgroundGradient() {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          opacity: theme === 'dark' ? 0.5 : 0.4,
          background: theme === 'dark'
            ? `
              radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.25) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, hsl(var(--accent) / 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, hsl(var(--secondary) / 0.2) 0%, transparent 50%)
            `
            : `
              radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, hsl(var(--accent) / 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, hsl(var(--secondary) / 0.1) 0%, transparent 50%)
            `
        }}
      />
    </div>
  )
}
