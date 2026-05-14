'use client'

import { X, ImageIcon, Grid3X3, Type, Link2, Share2, SlidersHorizontal } from 'lucide-react'
import type { ElementType } from '@/types'

interface ElementTypeMeta {
  type: ElementType
  label: string
  desc: string
  icon: React.ReactNode
  tint: string
  iconColor: string
}

const elementTypes: ElementTypeMeta[] = [
  { type: 'banner',       label: 'Banner',       desc: 'Hero with image, title & CTA',    icon: <ImageIcon size={18} />,        tint: 'bg-indigo-50',  iconColor: 'text-indigo-500' },
  { type: 'carousel',     label: 'Carousel',     desc: 'Scrollable image slideshow',       icon: <SlidersHorizontal size={18} />, tint: 'bg-violet-50',  iconColor: 'text-violet-500' },
  { type: 'card_grid',    label: 'Card Grid',    desc: '2 or 3 column grid of cards',      icon: <Grid3X3 size={18} />,           tint: 'bg-fuchsia-50', iconColor: 'text-fuchsia-500' },
  { type: 'text_block',   label: 'Text',         desc: 'Paragraph, heading or subheading', icon: <Type size={18} />,              tint: 'bg-sky-50',    iconColor: 'text-sky-500' },
  { type: 'button_link',  label: 'Button',       desc: 'CTA button linking to a URL',      icon: <Link2 size={18} />,             tint: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  { type: 'social_links', label: 'Social Links', desc: 'Row of social profile links',      icon: <Share2 size={18} />,            tint: 'bg-amber-50',   iconColor: 'text-amber-500' },
]

interface Props {
  onAdd: (type: ElementType) => void
  onClose: () => void
}

export default function AddElementModal({ onAdd, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <h2 className="text-base font-semibold">Add element</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {elementTypes.map(({ type, label, desc, icon, tint, iconColor }) => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="flex flex-col items-start gap-2.5 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm text-left transition-all group bg-white"
            >
              <span className={`flex items-center justify-center w-9 h-9 rounded-lg ${tint} ${iconColor} group-hover:scale-105 transition-transform`}>
                {icon}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{label}</p>
                <p className="text-xs text-slate-400 leading-snug mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
