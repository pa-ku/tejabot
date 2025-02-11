import { Quantico } from 'next/font/google'
import './globals.css'

const quantico = Quantico({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata = {
  title: 'TejaBot',
  description: 'Saca turnos desde la comodidad de un Bot',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={quantico.className}>{children}</body>
    </html>
  )
}