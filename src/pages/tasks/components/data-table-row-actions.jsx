import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'

export function DataTableRowActions() {
  const navigate = useNavigate()
  let actions = [
    {
      label: 'Edit',
      href: '/tasks/edit/1',
      separator: true,
    },
    {
      label: 'Delete',
      href: '/tasks/delete/1',
      separator: true,
    },
    {
      label: 'Delete',
      href: '/tasks/delete/1',
    },
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {actions?.map((action, index) => (
          <div key={index}>
            <div
              onClick={() => {
                navigate(action.href)
              }}
            >
              <DropdownMenuItem asChild>
                <a>{action?.label}</a>
              </DropdownMenuItem>
            </div>
            {action.separator && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
