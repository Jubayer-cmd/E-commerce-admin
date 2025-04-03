import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import React from 'react'

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  footer,
  size = 'default',
  ...props
}) {
  // Handle the open state change safely with useCallback to prevent infinite loops
  const handleOpenChange = React.useCallback(
    (open) => {
      if (!open) {
        onClose()
      }
    },
    [onClose]
  )

  // Determine width class based on size
  const sizeClasses = {
    default: 'max-w-lg',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} {...props}>
      <DialogContent
        className={cn(
          sizeClasses[size] || sizeClasses.default,
          'max-h-[85vh] overflow-y-auto',
          className
        )}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div>{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
