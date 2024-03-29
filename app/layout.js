import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import NextTopLoader from 'nextjs-toploader';
import { ReduxProvider } from '@/redux/provider';
import Navbar from '@/components/Navbar/Navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader color='red' easing="ease" showSpinner={false} />
        <Toaster />
        <ReduxProvider>
          <Navbar />
          {children}
          <SpeedInsights />
        </ReduxProvider>
      </body>
    </html>
  )
}
