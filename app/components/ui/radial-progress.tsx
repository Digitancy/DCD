'use client'

import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

interface RadialProgressProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'cube' | 'hex' | 'success' | 'warning' | 'error'
  showValue?: boolean
  label?: string
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32'
}

const colorClasses = {
  cube: 'text-cube-light',
  hex: 'text-hex-light',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500'
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl'
}

export function RadialProgress({ 
  value, 
  size = 'md', 
  color = 'cube',
  showValue = true,
  label
}: RadialProgressProps) {
  const percentage = Math.min(100, Math.max(0, value))
  const strokeDasharray = `${percentage} 100`
  
  return (
    <div className={cn('relative', sizeClasses[size])}>
      <motion.svg 
        className="w-full h-full"
        viewBox="0 0 100 100"
        initial={{ rotate: -90 }}
        animate={{ rotate: 270 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <motion.circle
          className={cn('transition-all duration-1000 ease-in-out', colorClasses[color])}
          strokeWidth="10"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: percentage / 100 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </motion.svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        {showValue && (
          <motion.span 
            className={cn('font-bold', textSizeClasses[size], colorClasses[color])}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {percentage}%
          </motion.span>
        )}
        {label && (
          <motion.div 
            className="text-sm text-gray-500 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {label}
          </motion.div>
        )}
      </div>
    </div>
  )
} 