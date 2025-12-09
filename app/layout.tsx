import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FluencySure - Master Languages with AI',
  description: 'Transform your language learning journey with AI-powered tools, personalized lessons, and interactive practice. Learn smarter, not harder.',
  keywords: ['language learning', 'AI tutor', 'learn languages', 'language app', 'speaking practice'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
