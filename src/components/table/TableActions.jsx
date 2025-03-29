import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
  ArchiveIcon,
} from '@radix-ui/react-icons'

export function TableActions({
  onEdit,
  onDelete,
  onArchiveToggle,
  isArchived,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil1Icon className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete}>
            <TrashIcon className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        )}
        {onArchiveToggle && (
          <DropdownMenuItem onClick={onArchiveToggle}>
            <ArchiveIcon className='mr-2 h-4 w-4' />
            {isArchived ? 'Unarchive' : 'Archive'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
