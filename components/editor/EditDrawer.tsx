'use client'

import { useState, useEffect } from 'react'
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
  useSortable,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { X, Plus, Trash2, GripVertical } from 'lucide-react'
import { between, byOrder, initialRanks } from '@/lib/order'
import type { ElementConfig, SocialPlatform } from '@/types'
import {
  FieldGroup,
  Input,
  Textarea,
  Select,
  Toggle,
  ColorRow,
  Divider,
} from './formPrimitives'

interface Props {
  element: ElementConfig
  onSave: (updated: ElementConfig) => void
  onClose: () => void
}

// ─── Sortable child list ──────────────────────────────────────────────────────

interface SortableChildProps {
  id: string
  index: number
  label: string
  onRemove: () => void
  children: React.ReactNode
}

function SortableChild({ id, index, label, onRemove, children }: SortableChildProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-slate-200 rounded-xl p-3.5 space-y-2.5 bg-white ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-indigo-500 transition-colors touch-none"
            title="Drag to reorder"
          >
            <GripVertical size={14} />
          </button>
          <span className="text-xs font-medium text-slate-500">{label} {index + 1}</span>
        </div>
        <button onClick={onRemove} className="text-slate-300 hover:text-red-500 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
      {children}
    </div>
  )
}

interface ChildListProps<T extends { id: string; order: string }> {
  items: T[]
  itemLabel: string
  onReorder: (id: string, newOrder: string) => void
  onRemove: (id: string) => void
  onAdd: () => void
  addLabel: string
  renderItem: (item: T) => React.ReactNode
}

function ChildList<T extends { id: string; order: string }>({
  items,
  itemLabel,
  onReorder,
  onRemove,
  onAdd,
  addLabel,
  renderItem,
}: ChildListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const sorted = [...items].sort(byOrder)

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const oldIdx = sorted.findIndex(i => i.id === active.id)
    const newIdx = sorted.findIndex(i => i.id === over.id)
    if (oldIdx === -1 || newIdx === -1) return
    const without = sorted.filter(i => i.id !== active.id)
    const prev = without[newIdx - 1]?.order ?? null
    const next = without[newIdx]?.order ?? null
    onReorder(active.id as string, between(prev, next))
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sorted.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {sorted.map((item, i) => (
            <SortableChild
              key={item.id}
              id={item.id}
              index={i}
              label={itemLabel}
              onRemove={() => onRemove(item.id)}
            >
              {renderItem(item)}
            </SortableChild>
          ))}
        </SortableContext>
      </DndContext>
      <button
        onClick={onAdd}
        className="w-full py-2.5 border border-dashed border-slate-400 rounded-xl text-xs text-slate-600 hover:text-indigo-500 hover:border-indigo-300 transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  )
}

// helper: compute order for a newly-appended child
function nextOrderFor<T extends { order: string }>(items: T[]): string {
  if (items.length === 0) return initialRanks(1)[0]
  const last = [...items].sort(byOrder)[items.length - 1].order
  return between(last, null)
}

// ─── Type-specific forms ──────────────────────────────────────────────────────

function BannerForm({ data, onChange }: { data: ElementConfig & { type: 'banner' }; onChange: (d: any) => void }) {
  const d = data.data
  const set = (key: string, val: any) => onChange({ ...d, [key]: val })
  return (
    <div className="space-y-4">
      <FieldGroup label="Title"><Input value={d.title} onChange={v => set('title', v)} /></FieldGroup>
      <FieldGroup label="Subtitle"><Textarea value={d.subtitle} onChange={v => set('subtitle', v)} rows={3} /></FieldGroup>
      <FieldGroup label="Image URL"><Input value={d.imageUrl} onChange={v => set('imageUrl', v)} placeholder="https://..." /></FieldGroup>
      <Divider label="CTA button" />
      <FieldGroup label="Button text"><Input value={d.ctaText} onChange={v => set('ctaText', v)} /></FieldGroup>
      <FieldGroup label="Button URL"><Input value={d.ctaUrl} onChange={v => set('ctaUrl', v)} placeholder="https://..." /></FieldGroup>
      <Divider label="Colors" />
      <div className="space-y-1 bg-slate-50/70 rounded-xl p-3">
        <ColorRow value={d.backgroundColor} onChange={v => set('backgroundColor', v)} label="Background" />
        <ColorRow value={d.textColor} onChange={v => set('textColor', v)} label="Text" />
      </div>
    </div>
  )
}

function CarouselForm({ data, onChange }: { data: ElementConfig & { type: 'carousel' }; onChange: (d: any) => void }) {
  const d = data.data
  const setTop = (key: string, val: any) => onChange({ ...d, [key]: val })
  const setItem = (id: string, key: string, val: string) =>
    onChange({ ...d, items: d.items.map((it: any) => it.id === id ? { ...it, [key]: val } : it) })
  const reorderItem = (id: string, newOrder: string) =>
    onChange({ ...d, items: d.items.map((it: any) => it.id === id ? { ...it, order: newOrder } : it) })
  const removeItem = (id: string) => onChange({ ...d, items: d.items.filter((it: any) => it.id !== id) })
  const addItem = () => onChange({
    ...d,
    items: [
      ...d.items,
      {
        id: `ci-${Date.now()}`,
        order: nextOrderFor(d.items),
        imageUrl: 'https://picsum.photos/seed/newci/800/400',
        title: 'New Slide',
        caption: '',
      },
    ],
  })

  return (
    <div className="space-y-4">
      <div className="space-y-1 bg-slate-50/70 rounded-xl p-3">
        <Toggle checked={d.autoPlay} onChange={v => setTop('autoPlay', v)} label="Auto-play" />
        <Toggle checked={d.showDots} onChange={v => setTop('showDots', v)} label="Show navigation dots" />
      </div>
      <Divider label={`Slides (${d.items.length})`} />
      <ChildList
        items={d.items}
        itemLabel="Slide"
        onReorder={reorderItem}
        onRemove={removeItem}
        onAdd={addItem}
        addLabel="Add slide"
        renderItem={(item: any) => (
          <>
            <Input value={item.imageUrl} onChange={v => setItem(item.id, 'imageUrl', v)} placeholder="Image URL" />
            <Input value={item.title} onChange={v => setItem(item.id, 'title', v)} placeholder="Title" />
            <Input value={item.caption} onChange={v => setItem(item.id, 'caption', v)} placeholder="Caption" />
          </>
        )}
      />
    </div>
  )
}

function CardGridForm({ data, onChange }: { data: ElementConfig & { type: 'card_grid' }; onChange: (d: any) => void }) {
  const d = data.data
  const set = (key: string, val: any) => onChange({ ...d, [key]: val })
  const setCard = (id: string, key: string, val: string) =>
    onChange({ ...d, cards: d.cards.map((c: any) => c.id === id ? { ...c, [key]: val } : c) })
  const reorderCard = (id: string, newOrder: string) =>
    onChange({ ...d, cards: d.cards.map((c: any) => c.id === id ? { ...c, order: newOrder } : c) })
  const removeCard = (id: string) => onChange({ ...d, cards: d.cards.filter((c: any) => c.id !== id) })
  const addCard = () => onChange({
    ...d,
    cards: [
      ...d.cards,
      {
        id: `card-${Date.now()}`,
        order: nextOrderFor(d.cards),
        title: 'New Card',
        description: '',
        imageUrl: 'https://picsum.photos/seed/nc/600/300',
        link: '#',
        linkText: 'View',
      },
    ],
  })

  return (
    <div className="space-y-4">
      <FieldGroup label="Section heading"><Input value={d.heading} onChange={v => set('heading', v)} placeholder="Optional heading" /></FieldGroup>
      <FieldGroup label="Columns">
        <Select<'2' | '3'> value={String(d.columns) as '2' | '3'} onChange={v => set('columns', Number(v) as 2 | 3)} options={[{ value: '2', label: '2 columns' }, { value: '3', label: '3 columns' }]} />
      </FieldGroup>
      <Divider label={`Cards (${d.cards.length})`} />
      <ChildList
        items={d.cards}
        itemLabel="Card"
        onReorder={reorderCard}
        onRemove={removeCard}
        onAdd={addCard}
        addLabel="Add card"
        renderItem={(card: any) => (
          <>
            <Input value={card.title} onChange={v => setCard(card.id, 'title', v)} placeholder="Title" />
            <Input value={card.description} onChange={v => setCard(card.id, 'description', v)} placeholder="Description" />
            <Input value={card.imageUrl} onChange={v => setCard(card.id, 'imageUrl', v)} placeholder="Image URL" />
            <Input value={card.link} onChange={v => setCard(card.id, 'link', v)} placeholder="Link URL" />
            <Input value={card.linkText} onChange={v => setCard(card.id, 'linkText', v)} placeholder="Link text" />
          </>
        )}
      />
    </div>
  )
}

function TextBlockForm({ data, onChange }: { data: ElementConfig & { type: 'text_block' }; onChange: (d: any) => void }) {
  const d = data.data
  const set = (key: string, val: any) => onChange({ ...d, [key]: val })
  return (
    <div className="space-y-4">
      <FieldGroup label="Content"><Textarea value={d.content} onChange={v => set('content', v)} /></FieldGroup>
      <FieldGroup label="Style">
        <Select value={d.variant} onChange={v => set('variant', v)} options={[
          { value: 'body', label: 'Body text' },
          { value: 'heading', label: 'Heading' },
          { value: 'subheading', label: 'Subheading' },
        ]} />
      </FieldGroup>
      <FieldGroup label="Alignment">
        <Select value={d.align} onChange={v => set('align', v)} options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]} />
      </FieldGroup>
    </div>
  )
}

function ButtonLinkForm({ data, onChange }: { data: ElementConfig & { type: 'button_link' }; onChange: (d: any) => void }) {
  const d = data.data
  const set = (key: string, val: any) => onChange({ ...d, [key]: val })
  return (
    <div className="space-y-4">
      <FieldGroup label="Button text"><Input value={d.text} onChange={v => set('text', v)} /></FieldGroup>
      <FieldGroup label="URL"><Input value={d.url} onChange={v => set('url', v)} placeholder="https://..." /></FieldGroup>
      <FieldGroup label="Style">
        <Select value={d.style} onChange={v => set('style', v)} options={[
          { value: 'primary', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
        ]} />
      </FieldGroup>
      <FieldGroup label="Alignment">
        <Select value={d.align} onChange={v => set('align', v)} options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]} />
      </FieldGroup>
      <div className="bg-slate-50/70 rounded-xl p-3">
        <Toggle checked={d.fullWidth} onChange={v => set('fullWidth', v)} label="Full width" />
      </div>
    </div>
  )
}

const socialPlatforms: Array<{ value: SocialPlatform; label: string }> = [
  { value: 'twitter', label: 'X (Twitter)' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
]

function SocialLinksForm({ data, onChange }: { data: ElementConfig & { type: 'social_links' }; onChange: (d: any) => void }) {
  const d = data.data
  const set = (key: string, val: any) => onChange({ ...d, [key]: val })
  const setLink = (id: string, key: string, val: string) =>
    onChange({ ...d, links: d.links.map((l: any) => l.id === id ? { ...l, [key]: val } : l) })
  const reorderLink = (id: string, newOrder: string) =>
    onChange({ ...d, links: d.links.map((l: any) => l.id === id ? { ...l, order: newOrder } : l) })
  const removeLink = (id: string) => onChange({ ...d, links: d.links.filter((l: any) => l.id !== id) })
  const addLink = () => onChange({
    ...d,
    links: [
      ...d.links,
      {
        id: `sl-${Date.now()}`,
        order: nextOrderFor(d.links),
        platform: 'twitter' as SocialPlatform,
        url: 'https://',
        label: 'Profile',
      },
    ],
  })

  return (
    <div className="space-y-4">
      <FieldGroup label="Section heading"><Input value={d.heading} onChange={v => set('heading', v)} placeholder="Optional heading" /></FieldGroup>
      <FieldGroup label="Display style">
        <Select value={d.style} onChange={v => set('style', v)} options={[
          { value: 'buttons', label: 'Buttons (icon + label)' },
          { value: 'icons', label: 'Icons only' },
        ]} />
      </FieldGroup>
      <FieldGroup label="Alignment">
        <Select value={d.align} onChange={v => set('align', v)} options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]} />
      </FieldGroup>
      <Divider label={`Links (${d.links.length})`} />
      <ChildList
        items={d.links}
        itemLabel="Link"
        onReorder={reorderLink}
        onRemove={removeLink}
        onAdd={addLink}
        addLabel="Add link"
        renderItem={(link: any) => (
          <>
            <Select<SocialPlatform> value={link.platform} onChange={v => setLink(link.id, 'platform', v)} options={socialPlatforms} />
            <Input value={link.url} onChange={v => setLink(link.id, 'url', v)} placeholder="https://..." />
            <Input value={link.label} onChange={v => setLink(link.id, 'label', v)} placeholder="Label" />
          </>
        )}
      />
    </div>
  )
}

// ─── Drawer shell ─────────────────────────────────────────────────────────────

const drawerTitles: Record<string, string> = {
  banner: 'Edit banner',
  carousel: 'Edit carousel',
  card_grid: 'Edit card grid',
  text_block: 'Edit text block',
  button_link: 'Edit button',
  social_links: 'Edit social links',
}

export default function EditDrawer({ element, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<ElementConfig>(element)
  useEffect(() => { setDraft(element) }, [element])

  const updateData = (newData: any) => setDraft(prev => ({ ...prev, data: newData } as ElementConfig))

  const renderForm = () => {
    switch (draft.type) {
      case 'banner':       return <BannerForm data={draft} onChange={updateData} />
      case 'carousel':     return <CarouselForm data={draft} onChange={updateData} />
      case 'card_grid':    return <CardGridForm data={draft} onChange={updateData} />
      case 'text_block':   return <TextBlockForm data={draft} onChange={updateData} />
      case 'button_link':  return <ButtonLinkForm data={draft} onChange={updateData} />
      case 'social_links': return <SocialLinksForm data={draft} onChange={updateData} />
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[3px]" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-[440px] bg-white border-l border-slate-200 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-900">{drawerTitles[draft.type]}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {renderForm()}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-colors shadow-sm shadow-indigo-200"
          >
            Save changes
          </button>
        </div>
      </div>
    </>
  )
}
