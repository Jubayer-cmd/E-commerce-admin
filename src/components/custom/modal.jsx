import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  footer,
  size = 'default', // Add size prop with default value
  ...props
}) {
  // Determine width class based on size
  const sizeClasses = {
    default: 'max-w-lg',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} {...props}>
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
