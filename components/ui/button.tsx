'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#c8a96e] text-[#0d1b2a] hover:bg-[#b8975e] font-semibold',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border-2 border-[#c8a96e] text-[#c8a96e] bg-transparent hover:bg-[#c8a96e] hover:text-[#0d1b2a]',
        secondary: 'bg-[#0d1b2a] text-white hover:bg-[#1a2f45]',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-[#c8a96e] underline-offset-4 hover:underline',
        white: 'bg-white text-[#0d1b2a] hover:bg-gray-100 font-semibold',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-9 rounded-md px-4',
        lg: 'h-12 rounded-md px-8 text-base',
        xl: 'h-14 rounded-md px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
