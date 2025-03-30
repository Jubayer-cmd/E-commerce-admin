import { Cross2Icon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function TableToolbar({
  table,
  searchableColumns = [],
  filterableColumns = [],
}) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Get the first searchable column if any
  const primarySearchColumn =
    searchableColumns.length > 0 ? searchableColumns[0] : null

  return (
    <div className='flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center'>
      <div className='flex flex-1 flex-col gap-4 sm:flex-row sm:items-center'>
        {primarySearchColumn && (
          <Input
            placeholder={`Search ${primarySearchColumn.title || primarySearchColumn.id}...`}
            value={
              table.getColumn(primarySearchColumn.id)?.getFilterValue() || ''
            }
            onChange={(event) =>
              table
                .getColumn(primarySearchColumn.id)
                ?.setFilterValue(event.target.value)
            }
            className='h-8 w-full sm:w-[250px]'
          />
        )}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset Filters
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex flex-row items-center gap-2'>
        {filterableColumns.map((column) => {
          const tableColumn = table.getColumn(column.id)

          if (!tableColumn) {
            console.warn(
              `Column with id '${column.id}' not found for filtering.`
            )
            return null
          }

          // Check if this is the isActive column for special handling
          const isActiveColumn = column.id === 'isActive'

          return (
            <DropdownMenu key={column.id}>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  {column.title || column.id}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                  {column.title || column.id}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {column.options.map((option) => {
                  // Get current filter values
                  const filterValue = tableColumn.getFilterValue() || []

                  // For boolean filters, compare stringified values to handle true/false properly
                  const isSelected = isActiveColumn
                    ? filterValue.some(
                        (val) => String(val) === String(option.value)
                      )
                    : filterValue.includes(option.value)

                  return (
                    <DropdownMenuCheckboxItem
                      key={String(option.value)}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        // Current filter values
                        const filterValues = tableColumn.getFilterValue() || []

                        // Convert the filter value based on the column type
                        let valueToUse = option.value

                        // For boolean columns, ensure we use the actual boolean value, not string
                        if (isActiveColumn) {
                          valueToUse =
                            typeof option.value === 'string'
                              ? option.value === 'true'
                              : option.value
                        }

                        if (checked) {
                          // Add to filters if not already included
                          tableColumn.setFilterValue([
                            ...filterValues.filter(
                              (val) => String(val) !== String(valueToUse)
                            ),
                            valueToUse,
                          ])
                        } else {
                          // Remove from filters
                          tableColumn.setFilterValue(
                            filterValues.filter(
                              (val) => String(val) !== String(valueToUse)
                            )
                          )
                        }
                      }}
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='ml-auto'>
              <MixerHorizontalIcon className='mr-2 h-4 w-4' />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  column.getCanHide() && !column.id.startsWith('filter_')
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}
                >
                  {column.id === 'isActive'
                    ? 'Status'
                    : column.id.charAt(0).toUpperCase() +
                      column.id.slice(1).replace(/([A-Z])/g, ' $1')}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
