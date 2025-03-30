import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import Modal from '@/components/custom/modal'
import SubcategoryForm from './components/SubcategoryForm'
import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'
import Loading from '../../../components/custom/loading'

export default function Subcategory() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    subcategory: null,
  })

  const {
    data: subcategories = [],
    isLoading,
    refetch,
  } = useFetchData('subcategories', '/subcategories/', {}, true)

  // Single function to manage modal state
  const toggleModal = (isOpen, subcategory = null) =>
    setModalState({ isOpen, subcategory })

  const modalTitle = modalState.subcategory
    ? 'Edit Sub-Category'
    : 'Create New Sub-Category'
  const modalDescription = modalState.subcategory
    ? 'Update subcategory information'
    : 'Add a new subcategory to your product catalog'

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Sub-Category</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <Button onClick={() => toggleModal(true)}>
            Create a new Sub-Category
          </Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <Loading />
          ) : (
            <ReusableTable
              data={subcategories.data || []}
              onEdit={(subcategory) => toggleModal(true, subcategory)}
              deleteEndpoint='/subcategories'
              archiveEndpoint='/subcategories'
              refetch={refetch}
              searchableColumns={[
                { id: 'name', title: 'Subcategory Name' },
                { id: 'category.name', title: 'Category Name' },
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
                  id: 'categoryId',
                  title: 'Category',
                  options: subcategories.data
                    ? [
                        ...new Map(
                          subcategories.data
                            .filter((item) => item.category) // Filter out items without category
                            .map((item) => [
                              item.category.id,
                              {
                                label: item.category.name,
                                value: item.category.id,
                              },
                            ])
                        ).values(),
                      ]
                    : [],
                },
              ]}
              excludeColumns={['createdAt', 'updatedAt', 'id', 'categoryId']}
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
        <SubcategoryForm
          onCancel={() => toggleModal(false)}
          refetch={refetch}
          subcategory={modalState.subcategory}
        />
      </Modal>
    </Layout>
  )
}
