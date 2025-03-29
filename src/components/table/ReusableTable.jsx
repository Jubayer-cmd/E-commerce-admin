import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { TablePagination } from './TablePagination'
import { TableToolbar } from './TableToolbar'
import { TableActions } from './TableActions'
import { toast } from '@/hooks/use-toast'
import usePostData from '@/hooks/apis/usePostData'
import Modal from '@/components/custom/modal'
import { Button } from '@/components/ui/button'

export function ReusableTable({
  data,
  onEdit,
  onDelete,
  deleteEndpoint,
  archiveEndpoint,
  refetch,
  filterableColumns = [],
  searchableColumns = [],
  excludeColumns = [],
  pageSize = 10,
}) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState({})
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [archiveAction, setArchiveAction] = useState('archive')

  // Setup mutations with usePostData
  const { mutate: deleteItem, isLoading: isDeleting } = usePostData(() => {
    toast({
      title: 'Success',
      description: 'Item deleted successfully',
    })
    setIsDeleteModalOpen(false)
    if (refetch) refetch()
  })

  const { mutate: toggleArchive, isLoading: isArchiving } = usePostData(() => {
    toast({
      title: 'Success',
      description: `Item ${archiveAction === 'archive' ? 'archived' : 'unarchived'} successfully`,
    })
    setIsArchiveModalOpen(false)
    if (refetch) refetch()
  })

  // Internal handler for delete operations
  const handleDelete = (item) => {
    // If custom onDelete is provided, use it instead
    if (onDelete) {
      return onDelete(item)
    }

    // Otherwise use the default implementation with modal
    if (!deleteEndpoint) {
      console.error('Delete endpoint not provided')
      return
    }

    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedItem) return

    deleteItem({
      method: 'delete',
      url: `${deleteEndpoint}/${selectedItem._id || selectedItem.id}`,
    })
  }

  // Internal handler for archive/unarchive operations
  const handleArchiveToggle = (item) => {
    if (!archiveEndpoint) {
      console.error('Archive endpoint not provided')
      return
    }

    // Determine if item is currently active or inactive
    const isActive = item.isActive
    const action = isActive ? 'archive' : 'unarchive'

    setSelectedItem(item)
    setArchiveAction(action)
    setIsArchiveModalOpen(true)
  }

  const confirmArchiveToggle = () => {
    if (!selectedItem) return

    // Toggle the isActive property
    const newIsActive = archiveAction === 'unarchive' // If we're unarchiving, set isActive to true

    // Make PATCH request with updated isActive value in body
    toggleArchive({
      method: 'patch',
      url: `${archiveEndpoint}/${selectedItem._id || selectedItem.id}`,
      data: { isActive: newIsActive }, // Send the new isActive value in request body
    })
  }

  // Automatically generate columns from data
  const columns = useMemo(() => {
    if (!data || data.length === 0) return []

    const firstRow = data[0]
    const generatedColumns = Object.keys(firstRow)
      .filter((key) => !excludeColumns.includes(key))
      .map((key) => {
        // Define custom headers for specific fields
        let header =
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')

        // Explicitly set header for isActive to "Status"
        if (key === 'isActive') {
          header = 'Status'
        }

        return {
          accessorKey: key,
          header,
          cell: ({ row }) => {
            // Special handling for isActive column to show status badges
            if (key === 'isActive') {
              const isActive = row.getValue(key)
              return (
                <div className='flex items-center'>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              )
            }

            // Default rendering for other columns
            return (
              <div className='max-w-[200px] truncate'>{row.getValue(key)}</div>
            )
          },
        }
      })

    // Add actions column
    generatedColumns.push({
      id: 'actions',
      cell: ({ row }) => (
        <TableActions
          row={row}
          onEdit={onEdit ? () => onEdit(row.original) : undefined}
          onDelete={
            deleteEndpoint || onDelete
              ? () => handleDelete(row.original)
              : undefined
          }
          onArchiveToggle={
            archiveEndpoint
              ? () => handleArchiveToggle(row.original)
              : undefined
          }
          isArchived={!row.original.isActive} // Make sure this is correctly negated
        />
      ),
      enableSorting: false,
      enableHiding: false,
    })

    return generatedColumns
  }, [data, excludeColumns, onEdit, onDelete, deleteEndpoint, archiveEndpoint])

  // Prepare table with boolean filter handling
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    filterFns: {
      // Add custom filter function for boolean values
      booleanFilter: (row, columnId, filterValues) => {
        const value = row.getValue(columnId)
        // Convert string 'true'/'false' to actual boolean if needed
        return filterValues.some((filterValue) => {
          const boolFilter =
            typeof filterValue === 'string'
              ? filterValue === 'true'
              : filterValue
          return value === boolFilter
        })
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  return (
    <div className='space-y-4'>
      <TableToolbar
        table={table}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Confirm Delete'
        description={`Are you sure you want to delete ${selectedItem?.name || 'this item'}?`}
      >
        <div className='flex justify-end space-x-2 pt-4'>
          <Button variant='outline' onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>

      {/* Archive/Unarchive confirmation modal */}
      <Modal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        title={`Confirm ${archiveAction === 'archive' ? 'Archive' : 'Unarchive'}`}
        description={`Are you sure you want to ${archiveAction} ${selectedItem?.name || 'this item'}?`}
      >
        <div className='flex justify-end space-x-2 pt-4'>
          <Button
            variant='outline'
            onClick={() => setIsArchiveModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmArchiveToggle}
            disabled={isArchiving}
            variant={archiveAction === 'unarchive' ? 'default' : 'secondary'}
          >
            {isArchiving
              ? 'Processing...'
              : archiveAction === 'archive'
                ? 'Archive'
                : 'Unarchive'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
