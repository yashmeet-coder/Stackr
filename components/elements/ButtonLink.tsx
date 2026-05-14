import type { ButtonLinkConfig } from '@/types'

const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }

const styleClass = {
  primary: 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-sm shadow-indigo-200 hover:shadow-md hover:-translate-y-0.5',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400',
}

export default function ButtonLink({ config }: { config: ButtonLinkConfig }) {
  const { text, url, style, align, fullWidth } = config.data

  return (
    <div className={alignClass[align]}>
      <a
        href={url}
        className={`inline-block px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${styleClass[style]} ${fullWidth ? 'w-full text-center' : ''}`}
      >
        {text}
      </a>
    </div>
  )
}
