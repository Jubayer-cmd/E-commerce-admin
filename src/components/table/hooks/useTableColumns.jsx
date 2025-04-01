import { useMemo } from 'react'
import { TableActions } from '../TableActions'

export function useTableColumns({
  data,
  excludeColumns,
  imageColumns,
  onView,
  onEdit,
  onDelete,
  onArchiveToggle,
  deleteEndpoint,
  archiveEndpoint,
  columnFormatters = {},
}) {
  return useMemo(() => {
    if (!data || data.length === 0) return []

    const firstRow = data[0]

    // Create a Set from excludeColumns for faster lookups
    const excludeColumnsSet = new Set(excludeColumns)

    // Get all possible column keys (excluding those in excludeColumns)
    const columnKeys = Object.keys(firstRow).filter(
      (key) => !excludeColumnsSet.has(key)
    )

    // Separate image columns and regular columns
    const imageColumnDefs = []
    const regularColumnDefs = []

    // Process each column key
    columnKeys.forEach((key) => {
      // Define custom headers for specific fields
      let header =
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')

      // Explicitly set header for isActive to "Status"
      if (key === 'isActive') {
        header = 'Status'
      }

      // Display "Usage Count" for _count field
      if (key === '_count') {
        header = 'Usage Count'
      }

      // Check if this is an image column
      const imageColumn = imageColumns.find((col) => col.id === key)

      // Base column definition
      const columnDef = {
        accessorKey: key,
        header,
        cell: ({ row }) => {
          // Check if there's a custom formatter for this column
          if (columnFormatters && columnFormatters[key]) {
            return columnFormatters[key](row.getValue(key), row)
          }

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

          // Special handling for image columns
          if (imageColumn) {
            const imageUrl = row.getValue(key)
            if (!imageUrl) return null

            return (
              <div className='flex items-center'>
                <img
                  src={imageUrl}
                  alt={`${header}`}
                  style={
                    imageColumn.imgStyle || {
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                    }
                  }
                  onError={(e) => {
                    console.error(`Failed to load image: ${imageUrl}`)
                    e.target.src = 'https://placehold.co/100x60?text=No+Image'
                  }}
                />
              </div>
            )
          }

          // Handle object values (like _count)
          const value = row.getValue(key)
          if (typeof value === 'object' && value !== null) {
            // Handle _count object specifically
            if (key === '_count' && 'usages' in value) {
              return (
                <div className='max-w-[200px] truncate'>{value.usages}</div>
              )
            }
            // For other objects, try to display them sensibly
            return (
              <div className='max-w-[200px] truncate'>
                {JSON.stringify(value)}
              </div>
            )
          }

          // Default rendering for primitive values
          return <div className='max-w-[200px] truncate'>{value}</div>
        },
      }

      // Add special filter function for boolean values
      if (key === 'isActive') {
        columnDef.filterFn = 'booleanFilter'
      }

      // Add to the appropriate array based on whether it's an image column
      if (imageColumn) {
        imageColumnDefs.push(columnDef)
      } else {
        regularColumnDefs.push(columnDef)
      }
    })

    // Create actions column
    const actionsColumn = {
      id: 'actions',
      cell: ({ row }) => (
        <TableActions
          row={row}
          onView={() => onView(row.original)}
          onEdit={onEdit ? () => onEdit(row.original) : undefined}
          onDelete={
            deleteEndpoint || onDelete
              ? () => onDelete(row.original)
              : undefined
          }
          onArchiveToggle={
            archiveEndpoint ? () => onArchiveToggle(row.original) : undefined
          }
          isArchived={!row.original.isActive}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }

    // Combine columns in the desired order: image columns first, then regular columns, then actions
    return [...imageColumnDefs, ...regularColumnDefs, actionsColumn]
  }, [
    data,
    excludeColumns,
    onEdit,
    onDelete,
    onView,
    onArchiveToggle,
    deleteEndpoint,
    archiveEndpoint,
    imageColumns,
    columnFormatters,
  ])
}
