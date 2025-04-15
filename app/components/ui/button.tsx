'use client'

import { forwardRef, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'
import { LucideIconWrapper, type IconName } from './components/LucideIcon'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'default' | 'outline' | 'ghost'
  iconName?: IconName
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', iconName, iconPosition = 'left', isLoading = false, children, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' && [
            'bg-gradient-to-r from-cube-light to-cube-dark text-white',
            'hover:from-cube-dark hover:to-cube-light',
            'shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.2)]',
          ],
          variant === 'outline' && [
            'border border-white/20 bg-white/5 backdrop-blur-sm',
            'hover:bg-white/10 hover:border-white/30',
            'shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.1)]',
          ],
          variant === 'ghost' && [
            'hover:bg-white/5',
            'active:bg-white/10',
          ],
          'h-10 px-6 py-2',
          className
        )}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          <>
            {iconName && iconPosition === 'left' && (
              <LucideIconWrapper name={iconName} size={20} className="mr-2" />
            )}
            {children}
            {iconName && iconPosition === 'right' && (
              <LucideIconWrapper name={iconName} size={20} className="ml-2" />
            )}
          </>
        )}
      </motion.button>
    )
  }
) 