import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
          'transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]',
          className
        )}
        {...props}
      />
    )
  }
) 