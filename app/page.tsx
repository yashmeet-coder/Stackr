'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { mockPageConfig } from '@/mockData'
import { byOrder } from '@/lib/order'
import ElementRenderer from '@/components/ElementRenderer'
import PageBackground from '@/components/PageBackground'
import type { PageConfig } from '@/types'

export default function PublicPage() {
  const [page, setPage] = useState<PageConfig>(mockPageConfig)

  useEffect(() => {
    const stored = localStorage.getItem('airlink_page')
    if (stored) {
      try {
        setPage(JSON.parse(stored))
      } catch {
        // ignore malformed data
      }
    }
  }, [])

  const visibleElements = [...page.elements].sort(byOrder).filter(e => e.visible)

  return (
    <div className="relative min-h-screen">
      <PageBackground background={page.theme.background} />
      {/* Header */}
      {/* <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm shadow-indigo-200">
              <span className="text-white text-xs font-bold tracking-tight">V</span>
            </div>
            <span
              className="font-semibold text-sm"
              style={page.theme.fontColor ? { color: page.theme.fontColor } : undefined}
            >
              {page.title}
            </span>
          </div>
          <Link
            href="/edit"
            className="text-xs text-slate-400 hover:text-indigo-600 transition-colors font-medium"
          >
            Edit page →
          </Link>
        </div>
      </header> */}
       <div className="flex mt-8 mb-4 flex-col gap-2 justify-self-center self-center items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm shadow-indigo-200">
                <span className="text-white text-base font-bold tracking-tight">V</span>
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-2xl" style={page.theme.fontColor ? { color: page.theme.fontColor } : undefined}>{page.title}</div>
                {/* <div className="text-slate-400 text-[11px]">/{page.slug}</div> */}
              </div>
            </div>

      {/* Page content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {visibleElements.map(element => (
          <ElementRenderer key={element.id} config={element} fontColor={page.theme.fontColor || undefined} />
        ))}
      </main>
    </div>
  )
}
