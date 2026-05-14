'use client'

import { useState, useEffect } from 'react'
import { X, Palette, ImageIcon, Film } from 'lucide-react'
import type { PageBackground, PageTheme } from '@/types'
import {
  FieldGroup,
  Input,
  ColorRow,
  Divider,
  Slider,
} from './formPrimitives'

interface Props {
  theme: PageTheme
  onSave: (theme: PageTheme) => void
  onClose: () => void
}

const DEFAULT_FALLBACK = '#0f172a'
const DEFAULT_OVERLAY = 0.4
const DEFAULT_BLUR = 0

// When the user switches the background type, preserve sensible defaults
// from the previous value where possible so they don't lose color/url info.
function morphBackground(current: PageBackground, nextType: PageBackground['type']): PageBackground {
  if (current.type === nextType) return current

  if (nextType === 'color') {
    const color = current.type === 'color' ? current.color : current.fallbackColor
    return { type: 'color', color }
  }

  // Going color → media: seed empty url with sensible defaults.
  if (current.type === 'color') {
    return {
      type: nextType,
      url: '',
      overlayOpacity: DEFAULT_OVERLAY,
      blur: DEFAULT_BLUR,
      fallbackColor: current.color || DEFAULT_FALLBACK,
    }
  }

  // Media → media: keep url/overlay/blur/fallback, just flip the type.
  return { ...current, type: nextType }
}

interface TypeOption {
  value: PageBackground['type']
  label: string
  icon: React.ReactNode
}

const typeOptions: TypeOption[] = [
  { value: 'color', label: 'Color', icon: <Palette size={14} /> },
  { value: 'image', label: 'Image', icon: <ImageIcon size={14} /> },
  { value: 'video', label: 'Video', icon: <Film size={14} /> },
]

function SegmentedTypePicker({ value, onChange }: { value: PageBackground['type']; onChange: (v: PageBackground['type']) => void }) {
  return (
    <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
      {typeOptions.map(opt => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              active
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

type Tab = 'background' | 'text'

export default function PageSettingsDrawer({ theme, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<PageTheme>(theme)
  const [activeTab, setActiveTab] = useState<Tab>('background')
  useEffect(() => { setDraft(theme) }, [theme])

  const setBackground = (bg: PageBackground) => setDraft(prev => ({ ...prev, background: bg }))

  const handleTypeChange = (nextType: PageBackground['type']) => {
    setBackground(morphBackground(draft.background, nextType))
  }

  const bg = draft.background

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[3px]" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-[440px] bg-white border-l border-slate-200 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-900">Page settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-1">
          {(['background', 'text'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-medium rounded-lg capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {activeTab === 'background' && (
            <>
              {/* Live preview */}
              <div className="relative h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <div className="absolute inset-0">
                  <PreviewSurface background={bg} />
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-white/90 bg-black/30 backdrop-blur px-2 py-0.5 rounded">
                    Preview
                  </span>
                </div>
              </div>

              <FieldGroup label="Background type">
                <SegmentedTypePicker value={bg.type} onChange={handleTypeChange} />
              </FieldGroup>

              {bg.type === 'color' && (
                <div className="bg-slate-50/70 rounded-xl p-3">
                  <ColorRow
                    value={bg.color}
                    onChange={v => setBackground({ type: 'color', color: v })}
                    label="Background color"
                  />
                </div>
              )}

              {(bg.type === 'image' || bg.type === 'video') && (
                <>
                  <FieldGroup label={bg.type === 'image' ? 'Image URL' : 'Video URL'}>
                    <Input
                      value={bg.url}
                      onChange={v => setBackground({ ...bg, url: v })}
                      placeholder={bg.type === 'image' ? 'https://…/photo.jpg' : 'https://…/clip.mp4'}
                    />
                  </FieldGroup>

                  <Divider label="Treatment" />
                  <div className="space-y-4 bg-slate-50/70 rounded-xl p-4">
                    <Slider
                      label="Overlay darkness"
                      value={bg.overlayOpacity}
                      onChange={v => setBackground({ ...bg, overlayOpacity: v })}
                      min={0}
                      max={1}
                      step={0.05}
                      format={v => `${Math.round(v * 100)}%`}
                    />
                    <Slider
                      label="Blur"
                      value={bg.blur}
                      onChange={v => setBackground({ ...bg, blur: v })}
                      min={0}
                      max={24}
                      step={1}
                      format={v => `${v}px`}
                    />
                    <ColorRow
                      value={bg.fallbackColor}
                      onChange={v => setBackground({ ...bg, fallbackColor: v })}
                      label="Fallback color"
                    />
                  </div>
                  {bg.type === 'video' && (
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Video plays muted and on loop. Use an `.mp4` or `.webm` URL that allows cross-origin embedding.
                    </p>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'text' && (
            <div className="bg-slate-50/70 rounded-xl p-3">
              <ColorRow
                value={draft.fontColor}
                onChange={v => setDraft(prev => ({ ...prev, fontColor: v }))}
                label="Text color"
              />
            </div>
          )}
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

// PageBackground itself renders fixed/-z-10 to cover the viewport. For the
// in-drawer preview we want it constrained to the preview box, so we render
// a parallel surface here that mirrors the same visual logic.
function PreviewSurface({ background }: { background: PageBackground }) {
  if (background.type === 'color') {
    return <div className="absolute inset-0" style={{ backgroundColor: background.color }} />
  }
  const { url, overlayOpacity, blur, fallbackColor } = background
  const mediaStyle: React.CSSProperties = {
    filter: blur > 0 ? `blur(${Math.min(blur, 12)}px)` : undefined,
    transform: blur > 0 ? 'scale(1.08)' : undefined,
  }
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: fallbackColor }}>
      {url && background.type === 'image' && (
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ ...mediaStyle, backgroundImage: `url(${JSON.stringify(url).slice(1, -1)})` }}
        />
      )}
      {url && background.type === 'video' && (
        <video
          key={url}
          src={url}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={mediaStyle}
        />
      )}
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
    </div>
  )
}

