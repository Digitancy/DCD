'use client'

import { motion } from 'framer-motion'
import { LucideIconWrapper, type IconName } from './LucideIcon'
import { cn } from '../../../lib/utils'

export type IconSize = 'sm' | 'md' | 'lg'

export interface IconProps {
  name: IconName
  size?: IconSize
  className?: string
  animate?: boolean
  spin?: boolean
}

const sizeMap: Record<IconSize, number> = {
  sm: 20,
  md: 24,
  lg: 32
}

export const Icon = ({ name, size = 'md', className, animate = true, spin = false }: IconProps) => {
  return (
    <motion.div
      whileHover={animate ? { scale: 1.1 } : undefined}
      whileTap={animate ? { scale: 0.95 } : undefined}
      animate={spin ? { rotate: 360 } : undefined}
      transition={spin ? { duration: 1, repeat: Infinity, ease: "linear" } : undefined}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <LucideIconWrapper name={name} size={sizeMap[size]} />
    </motion.div>
  )
}

Icon.displayName = 'Icon' 