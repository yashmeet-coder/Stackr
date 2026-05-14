import { ArrowUpRight } from 'lucide-react'
import { byOrder } from '@/lib/order'
import type { CardGridConfig } from '@/types'

export default function CardGrid({ config }: { config: CardGridConfig }) {
  const { heading, columns, cards } = config.data
  const sorted = [...cards].sort(byOrder)

  return (
    <div>
      {heading && <h2 className="text-lg font-semibold text-slate-900 mb-4">{heading}</h2>}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {sorted.map(card => (
          <div
            key={card.id}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-slate-200 transition-all duration-200 flex flex-col"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-slate-900 text-sm mb-1">{card.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-3 flex-1">{card.description}</p>
              {card.link && (
                <a
                  href={card.link}
                  className="inline-flex items-center gap-1 self-start text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  {card.linkText || 'View'}
                  <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
