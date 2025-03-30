import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import Modal from '@/components/custom/modal'
import CategoryForm from './components/CategoryForm'
import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'
import Loading from '../../../components/custom/loading'

export default function Category() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    category: null,
  })

  const {
    data: categories = [],
    isLoading,
    refetch,
  } = useFetchData('categories', '/categories/', {}, true)

  // Single function to manage modal state
  const toggleModal = (isOpen, category = null) =>
    setModalState({ isOpen, category })

  const modalTitle = modalState.category
    ? 'Edit Category'
    : 'Create New Category'
  const modalDescription = modalState.category
    ? 'Update category information'
    : 'Add a new category to your product catalog'

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Categories</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <Button onClick={() => toggleModal(true)}>
            Create a new Category
          </Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <Loading />
          ) : (
            <ReusableTable
              data={categories.data || []}
              onEdit={(category) => toggleModal(true, category)}
              deleteEndpoint='/categories'
              archiveEndpoint='/categories'
              refetch={refetch}
              searchableColumns={[{ id: 'name', title: 'Category Name' }]}
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
        <CategoryForm
          onCancel={() => toggleModal(false)}
          refetch={refetch}
          category={modalState.category}
        />
      </Modal>
    </Layout>
  )
}
