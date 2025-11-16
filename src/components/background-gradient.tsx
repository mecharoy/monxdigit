'use client'

export function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
      <div
        className="absolute inset-0 opacity-40 animate-gradient"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, hsl(var(--accent) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, hsl(var(--secondary) / 0.1) 0%, transparent 50%)
          `
        }}
      />
    </div>
  )
}
