import Modal from '@/components/custom/modal'
import { Button } from '@/components/ui/button'

export function ArchiveModal({
  isOpen,
  onClose,
  selectedItem,
  onConfirm,
  isArchiving,
  archiveAction,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Confirm ${archiveAction === 'archive' ? 'Archive' : 'Unarchive'}`}
      description={`Are you sure you want to ${archiveAction} ${selectedItem?.name || 'this item'}?`}
    >
      <div className='flex justify-end space-x-2 pt-4'>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
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
  )
}
