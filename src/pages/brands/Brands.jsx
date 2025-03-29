import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import Modal from '@/components/custom/modal'
import BrandForm from './components/BrandForm'
import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'

export default function Brands() {
  const [modalState, setModalState] = useState({ isOpen: false, brand: null })

  const {
    data: brands = [],
    isLoading,
    refetch,
  } = useFetchData('brands', '/brand/', {}, true)

  // Single function to manage modal state
  const toggleModal = (isOpen, brand = null) => setModalState({ isOpen, brand })

  const modalTitle = modalState.brand ? 'Edit Brand' : 'Create New Brand'
  const modalDescription = modalState.brand
    ? 'Update brand information'
    : 'Add a new brand to your product catalog'

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Brands</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <Button onClick={() => toggleModal(true)}>Create brand</Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <div className='flex h-64 items-center justify-center'>
              <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-primary'></div>
            </div>
          ) : (
            <ReusableTable
              data={brands.data || []}
              onEdit={(brand) => toggleModal(true, brand)}
              deleteEndpoint='/brand'
              archiveEndpoint='/brand'
              refetch={refetch}
              searchableColumns={[{ id: 'name', title: 'Brand Name' }]}
              filterableColumns={[
                {
                  id: 'isActive',
                  title: 'Status',
                  options: [
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                  ],
                },
              ]}
              excludeColumns={['createdAt', 'updatedAt', 'id']} // Columns to exclude from the table
              pageSize={10}
            />
          )}
        </div>
      </Layout.Body>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => toggleModal(false)}
        title={modalTitle}
        description={modalDescription}
      >
        <BrandForm
          onCancel={() => toggleModal(false)}
          refetch={refetch}
          brand={modalState.brand}
        />
      </Modal>
    </Layout>
  )
}
