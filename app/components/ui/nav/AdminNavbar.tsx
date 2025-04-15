'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { Icon } from '../components/Icon'
import { useTheme } from 'next-themes'

export default function AdminNavbar() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/digitancy-logo.png"
                alt="Digitancy Logo"
                width={40}
                height={40}
                className="hover:opacity-90 transition-opacity object-contain"
                priority
              />
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-hex-dark to-cube-dark bg-clip-text text-transparent">
                Administration Digitancy
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Changer le thème"
            >
              {theme === 'dark' ? (
                <Icon name="Sun" className="w-5 h-5" />
              ) : (
                <Icon name="Moon" className="w-5 h-5" />
              )}
            </button>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-cube-dark dark:hover:text-cube-light transition-colors"
            >
              Retour au site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-cube-dark dark:hover:text-cube-light transition-colors"
            >
              <Icon name="ArrowRight" className="w-4 h-4" size="sm" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
} 