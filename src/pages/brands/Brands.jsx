import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import Modal from '@/components/custom/modal'
import BrandForm from './components/BrandForm'
import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'

export default function Brands() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)

  const {
    data: brands = [],
    isLoading,
    refetch,
  } = useFetchData('brands', '/brand/', {}, true)

  const handleEdit = (brand) => {
    setSelectedBrand(brand)
    setIsModalOpen(true)
  }

  const handleOpenModal = () => {
    setSelectedBrand(null) // Reset selected brand for create mode
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBrand(null)
  }

  const handleFormSuccess = () => {
    setIsModalOpen(false)
    setSelectedBrand(null)
    // Use refetch from useFetchData to refresh data
    refetch()
  }

  const modalTitle = selectedBrand ? 'Edit Brand' : 'Create New Brand'
  const modalDescription = selectedBrand
    ? 'Update brand information'
    : 'Add a new brand to your product catalog'

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Brands</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <Button onClick={handleOpenModal}>Create brand</Button>
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
              onEdit={handleEdit}
              deleteEndpoint='/brand'
              archiveEndpoint='/brand'
              refetch={refetch}
              searchableColumns={[{ id: 'name', title: 'Brand Name' }]}
              filterableColumns={[
                {
                  id: 'isActive',
                  title: 'Status', // Set title to Status for dropdown display
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        description={modalDescription}
      >
        <BrandForm
          onCancel={handleCloseModal}
          onSuccess={handleFormSuccess}
          brand={selectedBrand}
        />
      </Modal>
    </Layout>
  )
}
