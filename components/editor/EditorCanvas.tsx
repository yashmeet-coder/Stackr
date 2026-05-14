'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { Plus, Eye, Pencil, ExternalLink, Settings2 } from 'lucide-react'
import { createDefaultElement } from '@/utils'
import { between, byOrder } from '@/lib/order'
import type { ElementConfig, ElementType, PageConfig, PageTheme } from '@/types'
import SortableElement from './SortableElement'
import AddElementModal from './AddElementModal'
import EditDrawer from './EditDrawer'
import PageSettingsDrawer from './PageSettingsDrawer'
import PageBackground from '@/components/PageBackground'

interface Props {
  initialPage: PageConfig
}

export default function EditorCanvas({ initialPage }: Props) {
  const [page, setPage] = useState<PageConfig>(initialPage)
  const [isPreview, setIsPreview] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPageSettings, setShowPageSettings] = useState(false)
  const [editingElement, setEditingElement] = useState<ElementConfig | null>(null)

  useEffect(() => {
    localStorage.setItem('airlink_page', JSON.stringify(page))
  }, [page])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Always derive the rendered list from `order`. Never trust array position.
  const sortedElements = useMemo(
    () => [...page.elements].sort(byOrder),
    [page.elements]
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return

    const list = sortedElements
    const oldIdx = list.findIndex(e => e.id === active.id)
    const newIdx = list.findIndex(e => e.id === over.id)
    if (oldIdx === -1 || newIdx === -1) return

    // After removing the dragged item, the target slot is at index `newIdx`
    // in the resulting list — regardless of whether we moved up or down.
    const without = list.filter(e => e.id !== active.id)
    const prev = without[newIdx - 1]?.order ?? null
    const next = without[newIdx]?.order ?? null
    const newOrder = between(prev, next)

    setPage(p => ({
      ...p,
      elements: p.elements.map(e =>
        e.id === active.id ? { ...e, order: newOrder } : e
      ),
    }))
  }

  const handleAdd = (type: ElementType) => {
    const draft = createDefaultElement(type)
    setPage(p => {
      const sorted = [...p.elements].sort(byOrder)
      const last = sorted[sorted.length - 1]?.order ?? null
      const placed = { ...draft, order: between(last, null) } as ElementConfig
      return { ...p, elements: [...p.elements, placed] }
    })
    setShowAddModal(false)
  }

  const handleDelete = (id: string) => {
    setPage(prev => ({ ...prev, elements: prev.elements.filter(e => e.id !== id) }))
  }

  const handleToggleVisibility = (id: string) => {
    setPage(prev => ({
      ...prev,
      elements: prev.elements.map(e => e.id === id ? { ...e, visible: !e.visible } : e),
    }))
  }

  const handleSaveEdit = (updated: ElementConfig) => {
    setPage(prev => ({
      ...prev,
      elements: prev.elements.map(e => e.id === updated.id ? updated : e),
    }))
    setEditingElement(null)
  }

  const handleSaveTheme = (theme: PageTheme) => {
    setPage(p => ({ ...p, theme }))
    setShowPageSettings(false)
  }

  const displayElements = isPreview
    ? sortedElements.filter(e => e.visible)
    : sortedElements

  return (
    <div className="relative min-h-screen">
      <PageBackground background={page.theme.background} />

      {/* ─── Toolbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/70">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-center">
          {/* Left */}
         

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ExternalLink size={13} />
              View page
            </Link>

            {!isPreview && (
              <>
                <button
                  onClick={() => setShowPageSettings(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Page settings"
                >
                  <Settings2 size={13} />
                  Page
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-colors shadow-sm shadow-indigo-200"
                >
                  <Plus size={13} />
                  Add element
                </button>
              </>
            )}

            <button
              onClick={() => setIsPreview(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isPreview
                  ? 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
              }`}
            >
              {isPreview ? <Pencil size={13} /> : <Eye size={13} />}
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Canvas ───────────────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-4 py-10">
        {displayElements.length === 0 ? (
          <div className="text-center py-28 text-slate-400">
            <p className="font-medium">No elements yet</p>
            <p className="text-sm mt-1">Click &ldquo;Add element&rdquo; to get started</p>
          </div>
        ) : (
          <Fragment>
            <div className="flex mb-8 flex-col gap-2 justify-self-center self-center items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm shadow-indigo-200">
                <span className="text-white text-base font-bold tracking-tight">V</span>
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-2xl" style={page.theme.fontColor ? { color: page.theme.fontColor } : undefined}>{page.title}</div>
                {/* <div className="text-slate-400 text-[11px]">/{page.slug}</div> */}
              </div>
            </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={displayElements.map(e => e.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {displayElements.map(element => (
                  <SortableElement
                    key={element.id}
                    element={element}
                    isPreview={isPreview}
                    fontColor={page.theme.fontColor || "#0f172a"}
                    onEdit={setEditingElement}
                    onDelete={handleDelete}
                    onToggleVisibility={handleToggleVisibility}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          </Fragment>
        )}

        {!isPreview && displayElements.length > 0 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-8 w-full bg-white py-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-sm text-black transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={15} />
            Add element
          </button>
        )}
      </main>

      {/* ─── Overlays ─────────────────────────────────────────────────────── */}
      {showAddModal && <AddElementModal onAdd={handleAdd} onClose={() => setShowAddModal(false)} />}
      {editingElement && <EditDrawer element={editingElement} onSave={handleSaveEdit} onClose={() => setEditingElement(null)} />}
      {showPageSettings && (
        <PageSettingsDrawer
          theme={page.theme}
          onSave={handleSaveTheme}
          onClose={() => setShowPageSettings(false)}
        />
      )}
    </div>
  )
}
