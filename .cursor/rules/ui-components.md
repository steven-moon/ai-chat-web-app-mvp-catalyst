# UI Components Rules
**Applies to**: `src/components/ui/**/*.tsx`

## UI Component Structure
- Use shadcn/ui components as a foundation
- Extend and customize components as needed
- Keep components small and focused
- Use composition for complex components
- Implement proper prop typing

## Component Variants
- Use cva (class-variance-authority) for component variants
- Define variants in a consistent manner
- Support size, color, and style variants
- Provide sensible defaults for all variants

## Example Component with Variants
```tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
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

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
```

## Styling
- Use Tailwind CSS for styling
- Follow the project's color scheme
- Use CSS variables for theming
- Implement dark mode support
- Use responsive design principles
- Use consistent spacing and sizing

## Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Support screen readers
- Implement focus management
- Test with accessibility tools

## Animation and Transitions
- Use framer-motion for complex animations
- Use CSS transitions for simple animations
- Keep animations subtle and purposeful
- Respect user preferences for reduced motion
- Ensure animations don't interfere with usability

## Form Components
- Implement proper form validation
- Show validation errors inline
- Support disabled and loading states
- Implement proper focus management
- Support keyboard navigation
- Use consistent styling for form elements

## Layout Components
- Create reusable layout components
- Implement responsive layouts
- Use CSS Grid and Flexbox appropriately
- Support different screen sizes
- Implement proper spacing and alignment

## Icons and Images
- Use Lucide React for icons
- Optimize images for performance
- Provide alt text for images
- Use appropriate image formats
- Implement lazy loading for images

## Performance
- Optimize component rendering
- Use React.memo for expensive components
- Implement proper dependency arrays
- Avoid unnecessary re-renders
- Use code splitting for large components 