import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Icon } from './components/ui/components'
import Image from 'next/image'
import { Lock } from 'lucide-react'
import { ThemeToggle } from './components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Diagnostic de Compétences Digitales',
  description: 'Évaluez les compétences digitales de votre organisation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <Providers>
          <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <a href="/" className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <Image
                        src="/images/digitancy-logo.png"
                        alt="Digitancy Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-cube-light to-cube-dark bg-clip-text text-transparent">
                      Digitancy
                    </span>
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <a
                    href="/admin/login"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-cube-dark dark:hover:text-cube-light px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Administration</span>
                  </a>
                </div>
              </div>
            </nav>
          </header>
          <main className="pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
} 