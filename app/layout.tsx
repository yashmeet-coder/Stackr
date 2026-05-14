import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Airlink',
  description: 'Build and share your page',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{children}</body>
    </html>
  )
}
