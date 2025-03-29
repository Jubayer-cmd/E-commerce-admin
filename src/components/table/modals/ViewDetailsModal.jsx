import Modal from '@/components/custom/modal'
import { Button } from '@/components/ui/button'
import { formatDisplayName } from '@/lib/utils'

export function ViewDetailsModal({
  isOpen,
  onClose,
  selectedItem,
  excludeColumns = [],
  imageColumns = [],
}) {
  const renderItemDetails = () => {
    if (!selectedItem) return null

    return (
      <div className='space-y-6 px-1'>
        {Object.entries(selectedItem)
          .filter(([key]) => !excludeColumns.includes(key))
          .map(([key, value]) => {
            // Special handling for image columns
            const isImageColumn = imageColumns.some((col) => col.id === key)

            // Format the key name for display
            const displayName = formatDisplayName(key)

            return (
              <div
                key={key}
                className='group rounded-lg border border-gray-100 bg-[#2a2a2ac1] p-4 shadow-sm transition-all hover:shadow-md'
              >
                <div className='mb-2 text-sm font-semibold uppercase tracking-wide text-white'>
                  {displayName}
                </div>
                <div className='mt-1'>
                  {isImageColumn && value ? (
                    <div className='overflow-hidden rounded-md border border-gray-200 bg-black'>
                      <img
                        src={value}
                        alt={displayName}
                        className='h-40 w-full object-contain'
                        onError={(e) => {
                          e.target.src =
                            'https://placehold.co/400x200?text=No+Image'
                        }}
                      />
                    </div>
                  ) : key === 'isActive' ? (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        value
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <span
                        className={`mr-1.5 h-2 w-2 rounded-full ${value ? 'bg-green-600' : 'bg-gray-500'}`}
                      ></span>
                      {value ? 'Active' : 'Inactive'}
                    </span>
                  ) : typeof value === 'boolean' ? (
                    <span
                      className={`text-base font-medium ${value ? 'text-blue-600' : 'text-gray-600'}`}
                    >
                      {value ? 'Yes' : 'No'}
                    </span>
                  ) : Array.isArray(value) ? (
                    <div className='flex flex-wrap gap-1'>
                      {value.length > 0 ? (
                        value.map((item, i) => (
                          <span
                            key={i}
                            className='inline-block rounded-md bg-gray-100 px-2 py-1 text-sm'
                          >
                            {String(item)}
                          </span>
                        ))
                      ) : (
                        <span className='italic text-gray-500'>None</span>
                      )}
                    </div>
                  ) : (
                    <div className='break-words text-base'>
                      {value ? (
                        String(value)
                      ) : (
                        <span className='italic text-gray-400'>N/A</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
      </div>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${selectedItem?.name || 'Item'} Details`}
    >
      <div className='mt-4 max-h-[70vh] overflow-y-auto pb-4 pr-2'>
        {renderItemDetails()}
      </div>
      <div className='mt-4 flex justify-end space-x-2 border-t pt-6'>
        <Button variant='outline' onClick={onClose} className='px-6'>
          Close
        </Button>
      </div>
    </Modal>
  )
}
