import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Vendor App by Building Community Inc',
  description: 'Vendor App presented by Building Community Inc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`bg-background text-secondary ${inter.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}

