import './globals.css'
import { Inter, Roboto, Darker_Grotesque } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import localFont from 'next/font/local'


const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({ subsets: ['latin'], weight: "400" })
const darkerGrotesque = Darker_Grotesque({ subsets: ['latin'], weight: "variable" })
const segoe = localFont({ src: "./segoe-ui.ttf" })

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
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <head>
          <script defer data-domain="vendorapp.buildingcommunityinc.com" src="https://plausible.io/js/script.js"></script>
        </head>
        <body className={`bg-background text-primary ${inter.className} ${roboto.className} ${segoe.className} ${darkerGrotesque.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}

