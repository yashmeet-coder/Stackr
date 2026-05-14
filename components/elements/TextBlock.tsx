import type { TextBlockConfig } from '@/types'

const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }

export default function TextBlock({ config, fontColor }: { config: TextBlockConfig; fontColor?: string }) {
  const { content, align, variant } = config.data
  const colorStyle = fontColor ? { color: fontColor } : undefined

  if (variant === 'heading') {
    return <h2 className={`text-2xl font-semibold tracking-tight text-slate-900 ${alignClass[align]}`} style={colorStyle}>{content}</h2>
  }
  if (variant === 'subheading') {
    return <h3 className={`text-base font-semibold text-slate-700 ${alignClass[align]}`} style={colorStyle}>{content}</h3>
  }
  return <p className={`text-slate-600 leading-7 text-sm ${alignClass[align]}`} style={colorStyle}>{content}</p>
}
