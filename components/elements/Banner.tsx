import type { BannerConfig } from '@/types'

export default function Banner({ config }: { config: BannerConfig }) {
  const { title, subtitle, imageUrl, ctaText, ctaUrl, backgroundColor, textColor } = config.data

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm" style={{ backgroundColor }}>
      {imageUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${backgroundColor}00 0%, ${backgroundColor}cc 70%, ${backgroundColor} 100%)`,
            }}
          />
        </>
      )}
      <div className="relative z-10 px-8 py-16 text-center" style={{ color: textColor }}>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm leading-relaxed opacity-85 mb-7 max-w-md mx-auto">{subtitle}</p>
        )}
        {ctaText && (
          <a
            href={ctaUrl}
            className="inline-block px-7 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ backgroundColor: textColor, color: backgroundColor }}
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  )
}
