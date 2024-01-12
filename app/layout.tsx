import './globals.css'
import { Inter, Roboto } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({ subsets: ['latin'], weight: "400" })

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
    <ClerkProvider appearance={{baseTheme: dark}}>
      <html lang="en">
        <body className={`bg-background text-secondary ${inter.className} ${roboto.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}

