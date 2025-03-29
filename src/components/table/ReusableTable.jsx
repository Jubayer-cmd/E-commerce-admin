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

export function ReusableTable({
  data,
  onEdit,
  onDelete,
  filterableColumns = [],
  searchableColumns = [],
  excludeColumns = [],
  pageSize = 10,
}) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState({})
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])

  // Automatically generate columns from data
  const columns = useMemo(() => {
    if (!data || data.length === 0) return []

    const firstRow = data[0]
    const generatedColumns = Object.keys(firstRow)
      .filter((key) => !excludeColumns.includes(key))
      .map((key) => ({
        accessorKey: key,
        header:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        cell: ({ row }) => (
          <div className='max-w-[200px] truncate'>{row.getValue(key)}</div>
        ),
      }))

    // Add actions column if handlers are provided
    if (onEdit || onDelete) {
      generatedColumns.push({
        id: 'actions',
        cell: ({ row }) => (
          <TableActions
            row={row}
            onEdit={onEdit ? () => onEdit(row.original) : undefined}
            onDelete={onDelete ? () => onDelete(row.original) : undefined}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      })
    }

    return generatedColumns
  }, [data, excludeColumns, onEdit, onDelete])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
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
    </div>
  )
}
