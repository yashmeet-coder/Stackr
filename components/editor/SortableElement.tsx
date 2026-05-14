'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import type { ElementConfig } from '@/types'
import ElementRenderer from '@/components/ElementRenderer'

const typeLabels: Record<string, string> = {
  banner: 'Banner',
  carousel: 'Carousel',
  card_grid: 'Card Grid',
  text_block: 'Text Block',
  button_link: 'Button',
  social_links: 'Social Links',
}

interface Props {
  element: ElementConfig
  isPreview: boolean
  fontColor: string
  onEdit: (element: ElementConfig) => void
  onDelete: (id: string) => void
  onToggleVisibility: (id: string) => void
}

export default function SortableElement({ element, isPreview, fontColor, onEdit, onDelete, onToggleVisibility }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-40 z-50' : ''}`}
    >
      {!isPreview && (
        <>
          {/* Left rail: drag handle anchored outside the element */}
          <div className="absolute -left-9 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              {...attributes}
              {...listeners}
              className="flex flex-col items-center justify-center w-7 h-12 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-300 hover:text-indigo-500 hover:border-indigo-200 cursor-grab active:cursor-grabbing touch-none transition-colors"
              title="Drag to reorder"
            >
              <GripVertical size={14} />
            </button>
          </div>

          {/* Top-right action bar */}
          <div className="absolute -top-3.5 right-0 z-20 flex items-center bg-white border border-slate-200 rounded-lg shadow-sm divide-x divide-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-2.5 py-1.5 text-[11px] font-medium text-slate-500">{typeLabels[element.type]}</span>
            <button
              onClick={() => onToggleVisibility(element.id)}
              className="px-2 py-1.5 text-slate-400 hover:text-slate-700 transition-colors"
              title={element.visible ? 'Hide' : 'Show'}
            >
              {element.visible ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
            <button
              onClick={() => onEdit(element)}
              className="px-2 py-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(element.id)}
              className="px-2 py-1.5 text-slate-400 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </>
      )}

      <div
        className={`${!isPreview ? 'ring-1 ring-transparent group-hover:ring-2 group-hover:ring-indigo-100 rounded-2xl transition-all' : ''}`}
        onDoubleClick={() => !isPreview && onEdit(element)}
      >
        {element.visible ? (
          <ElementRenderer config={element} fontColor={fontColor} />
        ) : (
          !isPreview && (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex items-center justify-center gap-2 text-slate-400 text-xs bg-slate-50/50">
              <EyeOff size={13} />
              {typeLabels[element.type]} — hidden
            </div>
          )
        )}
      </div>
    </div>
  )
}
