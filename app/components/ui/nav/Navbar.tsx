'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
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
                Diagnostic des compétences digitales
              </h1>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-hex-dark to-cube-dark bg-clip-text text-transparent">
                Diagnostic digital
              </h1>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
} 