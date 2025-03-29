import Modal from '@/components/custom/modal'
import { Button } from '@/components/ui/button'

export function DeleteModal({
  isOpen,
  onClose,
  selectedItem,
  onConfirm,
  isDeleting,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Confirm Delete'
      description={`Are you sure you want to delete ${selectedItem?.name || 'this item'}?`}
    >
      <div className='flex justify-end space-x-2 pt-4'>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='destructive' onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  )
}
