'use client'

import type { PageBackground as PageBackgroundType } from '@/types'

interface Props {
  background: PageBackgroundType
}

// Renders the page background as a viewport-sized layer behind everything
// else. Foreground content scrolls above it. The layer never intercepts
// clicks (pointer-events-none) and sits at z-index -10 so any positioned
// element with z-index 0+ stays on top.
export default function PageBackground({ background }: Props) {
  if (background.type === 'color') {
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ backgroundColor: background.color }}
      />
    )
  }

  const { url, overlayOpacity, blur, fallbackColor } = background
  // CSS blur softens edges by shrinking the visible region. Scale slightly
  // so blurred edges still cover the viewport.
  const mediaStyle: React.CSSProperties = {
    filter: blur > 0 ? `blur(${blur}px)` : undefined,
    transform: blur > 0 ? 'scale(1.08)' : undefined,
    transformOrigin: 'center',
  }

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{ backgroundColor: fallbackColor }}
    >
      {background.type === 'image' ? (
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ ...mediaStyle, backgroundImage: `url(${JSON.stringify(url).slice(1, -1)})` }}
        />
      ) : (
        <video
          key={url /* force reload when url changes */}
          src={url}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          style={mediaStyle}
        />
      )}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  )
}
