import Navbar from '@/components/Navbar'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import ReactQueryProvider from '@/context/ReactQueryProvider'
import { AllocatorProvider } from '@/lib/AllocatorProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Filecoin Plus Registry',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className + ' h-screen'}>
        <ReactQueryProvider>
          <AuthProvider>
            <AllocatorProvider>
              <Navbar />
              {children}
            </AllocatorProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
