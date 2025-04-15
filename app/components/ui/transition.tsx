'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TransitionProps {
  children: ReactNode
  className?: string
}

export function Transition({ children, className }: TransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
} 