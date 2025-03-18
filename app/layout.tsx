import './globals.css'
import { Inter, Roboto } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import localFont from 'next/font/local'


const inter = Inter({ 
  subsets: ['latin'],
  variable: "--font-inter"
})
const darkerGrotesque = localFont({
   src: "./fonts/DarkerGrotesque/static/DarkerGrotesque-Regular.ttf",
   variable: "--font-darker-grotesque",
   display: "swap"

  }
)
const roboto = Roboto({ subsets: ['latin'], weight: "400" })
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
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
          <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body className={`bg-background text-primary ${inter.variable} ${roboto.className} ${segoe.className} ${darkerGrotesque.variable}`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}

