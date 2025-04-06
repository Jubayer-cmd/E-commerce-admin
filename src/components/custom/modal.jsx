import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

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
  // Add internal state to prevent recursive updates
  const [internalOpen, setInternalOpen] = useState(false)

  // Sync the internal state with the isOpen prop
  useEffect(() => {
    setInternalOpen(isOpen)
  }, [isOpen])

  // Handle the open state change safely
  const handleOpenChange = (open) => {
    // Only call onClose when closing
    if (!open) {
      onClose()
    }
  }

  // Determine width class based on size
  const sizeClasses = {
    default: 'max-w-lg',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }

  return (
    <Dialog open={internalOpen} onOpenChange={handleOpenChange} {...props}>
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
