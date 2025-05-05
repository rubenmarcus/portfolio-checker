import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer text-white',
  {
    variants: {
      variant: {
        default:
          'bg-blue-800/80 backdrop-blur-sm text-white shadow-md shadow-blue-900/30 hover:bg-blue-700/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
        destructive:
          'bg-destructive text-white shadow-md shadow-destructive/20 hover:bg-destructive/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'border border-blue-700/40 bg-blue-900/30 backdrop-blur-sm text-white shadow-md hover:bg-blue-700/40 hover:text-white hover:border-blue-600/60 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-zinc-700 text-white shadow-md hover:bg-zinc-600 hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
        ghost: 'hover:bg-zinc-700/50 text-white hover:text-white active:scale-[0.98]',
        link: 'text-white underline-offset-4 hover:underline hover:text-white',
        blue: 'bg-blue-800/80 backdrop-blur-sm text-white shadow-md shadow-blue-900/30 hover:bg-blue-700/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-4 py-2.5',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "text-white")}
        style={{ color: 'white' }}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
