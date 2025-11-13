import { useMemo } from "react"

type Bubble = { size: number; left: number; top: number; duration: number; delay: number; opacity: number }

export default function BubblesBackground() {
  const bubbles = useMemo<Bubble[]>(
    () =>
      Array.from({ length: 14 }).map(() => ({
        size: Math.floor(80 + Math.random() * 200),
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 10 + Math.random() * 18,
        delay: Math.random() * 4,
        opacity: 0.2 + Math.random() * 0.35,
      })),
    []
  )

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-emerald-50 to-white">
      {bubbles.map((b, i) => (
        <span
          key={i}
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            top: `${b.top}%`,
            opacity: b.opacity,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
          className="pointer-events-none absolute rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,.45),rgba(16,185,129,.15)_60%,transparent_65%)] blur-md animate-bubble"
        />
      ))}
    </div>
  )
}
