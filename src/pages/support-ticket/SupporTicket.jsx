import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import Modal from '@/components/custom/modal'
import SupportTicketForm from './components/SupportTicketForm'
import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'
import Loading from '../../components/custom/loading'

export default function SupportTicket() {
  const [modalState, setModalState] = useState({ isOpen: false, ticket: null })

  const {
    data: tickets = [],
    isLoading,
    refetch,
  } = useFetchData('support', '/support/', {}, true)

  // Function to open modal for editing
  const openEditModal = (ticket) => setModalState({ isOpen: true, ticket })

  // Function to close modal
  const closeModal = () => setModalState({ isOpen: false, ticket: null })

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Support Tickets</h1>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <Loading />
          ) : (
            <ReusableTable
              data={tickets.data || []}
              onEdit={openEditModal}
              deleteEndpoint='/support'
              archiveEndpoint='/support'
              refetch={refetch}
              searchableColumns={[
                { id: 'title', title: 'Ticket Title' },
                { id: 'description', title: 'Description' },
              ]}
              filterableColumns={[
                {
                  id: 'isActive',
                  title: 'Status',
                  options: [
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                  ],
                },
                {
                  id: 'status',
                  title: 'Ticket Status',
                  options: [
                    { label: 'Open', value: 'open' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Closed', value: 'closed' },
                  ],
                },
              ]}
              excludeColumns={['createdAt', 'updatedAt', 'id', 'userId']}
              pageSize={10}
            />
          )}
        </div>
      </Layout.Body>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title='Edit Ticket'
        description='Update ticket information'
      >
        <SupportTicketForm
          onCancel={closeModal}
          refetch={refetch}
          ticket={modalState.ticket}
        />
      </Modal>
    </Layout>
  )
}
