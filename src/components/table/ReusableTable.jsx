import { useState, useEffect } from 'react'
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
import usePostData from '@/hooks/apis/useMutationData'
import { useTableColumns } from './hooks/useTableColumns'
import { ViewDetailsModal } from './modals/ViewDetailsModal'
import { DeleteModal } from './modals/DeleteModal'
import { ArchiveModal } from './modals/ArchiveModal'
import { toast } from 'sonner'

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
  imageColumns = [],
  columnFormatters = {},
}) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState({})
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [archiveAction, setArchiveAction] = useState('archive')

  // Setup mutations with usePostData
  const { mutate: deleteItem, isLoading: isDeleting } = usePostData(() => {
    toast.success('Success', {
      description: `Item deleted successfully`,
    })
    setIsDeleteModalOpen(false)
    if (refetch) refetch()
  })

  const { mutate: toggleArchive, isLoading: isArchiving } = usePostData(() => {
    toast.success('Success', {
      description: `Item ${archiveAction === 'archive' ? 'archived' : 'unarchived'} successfully`,
    })
    setIsArchiveModalOpen(false)
    if (refetch) refetch()
  })

  // View details handler
  const handleView = (item) => {
    setSelectedItem(item)
    setIsViewModalOpen(true)
  }

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

  // Extract filter-only columns (columns that are excluded but used for filtering)
  const filterOnlyColumnIds = filterableColumns
    .map((col) => col.id)
    .filter((id) => excludeColumns.includes(id))

  // Generate columns using the dedicated hook
  const columns = useTableColumns({
    data,
    excludeColumns,
    imageColumns,
    onView: handleView,
    onEdit,
    onDelete: handleDelete,
    onArchiveToggle: handleArchiveToggle,
    deleteEndpoint,
    archiveEndpoint,
    columnFormatters,
  })

  // Create visibility state with excluded columns hidden
  const getExcludedVisibility = () => {
    const visibility = {}
    excludeColumns.forEach((col) => {
      visibility[col] = false
    })
    return visibility
  }

  // Initialize column visibility state
  useEffect(() => {
    setColumnVisibility((prev) => ({
      ...prev,
      ...getExcludedVisibility(),
    }))
  }, [excludeColumns.join(',')])

  // Add any additional accessor columns needed for filtering
  const filterOnlyAccessors = filterOnlyColumnIds.map((id) => ({
    accessorKey: id,
    id: id,
    header: id.charAt(0).toUpperCase() + id.slice(1),
    enableHiding: false,
    size: 0,
    minSize: 0,
  }))

  const allColumns = [...columns, ...filterOnlyAccessors]

  const table = useReactTable({
    data,
    columns: allColumns,
    state: {
      sorting,
      columnVisibility: {
        ...getExcludedVisibility(),
        ...columnVisibility,
      },
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
    onColumnVisibilityChange: (updatedVisibility) => {
      // Apply the updated visibility while keeping excluded columns hidden
      const newVisibility = { ...updatedVisibility }
      excludeColumns.forEach((col) => {
        newVisibility[col] = false
      })
      setColumnVisibility(newVisibility)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
      // Set excluded columns as hidden in the initial state
      columnVisibility: getExcludedVisibility(),
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
                  colSpan={allColumns.length}
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

      {/* Use dedicated modal components */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        selectedItem={selectedItem}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <ArchiveModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        selectedItem={selectedItem}
        onConfirm={confirmArchiveToggle}
        isArchiving={isArchiving}
        archiveAction={archiveAction}
      />

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        selectedItem={selectedItem}
        excludeColumns={excludeColumns}
        imageColumns={imageColumns}
      />
    </div>
  )
}
