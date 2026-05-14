'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { byOrder } from '@/lib/order'
import type { CarouselConfig } from '@/types'

export default function Carousel({ config }: { config: CarouselConfig }) {
  const { items, autoPlay, showDots } = config.data
  const sorted = useMemo(() => [...items].sort(byOrder), [items])
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(i => (i + 1) % sorted.length), [sorted.length])
  const prev = () => setCurrent(i => (i - 1 + sorted.length) % sorted.length)

  useEffect(() => {
    if (!autoPlay || sorted.length <= 1) return
    const t = setInterval(next, 3500)
    return () => clearInterval(t)
  }, [autoPlay, next, sorted.length])

  // Reset if items shrink past current
  useEffect(() => {
    if (current >= sorted.length) setCurrent(0)
  }, [current, sorted.length])

  if (sorted.length === 0) return null
  const item = sorted[current] ?? sorted[0]

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-sm">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-72 object-cover"
        />
        {/* Caption scrim */}
        {(item.title || item.caption) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pt-12 pb-5">
            {item.title && <p className="font-semibold text-white text-sm">{item.title}</p>}
            {item.caption && <p className="text-white/80 text-xs mt-0.5">{item.caption}</p>}
          </div>
        )}

        {sorted.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white rounded-full p-2 transition-colors backdrop-blur"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white rounded-full p-2 transition-colors backdrop-blur"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {showDots && sorted.length > 1 && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
