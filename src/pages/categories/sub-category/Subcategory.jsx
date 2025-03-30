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

  const { data: categories, isLoading: categoriesLoading } = useFetchData(
    'categories',
    '/categories/',
    {},
    true
  )

  // Single function to manage modal state
  const toggleModal = (isOpen, subcategory = null) =>
    setModalState({ isOpen, subcategory })

  // Transform the data to include category names
  const processedSubcategories = (subcategories.data || []).map((item) => {
    // Find the matching category
    const matchingCategory = (categories?.data || []).find(
      (category) => category.id === item.categoryId
    )

    return {
      ...item,
      // Add categoryName property with the actual category name
      categoryName: matchingCategory ? matchingCategory.name : 'Not Assigned',
    }
  })

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
          {isLoading || categoriesLoading ? (
            <Loading />
          ) : (
            <ReusableTable
              data={processedSubcategories}
              onEdit={(subcategory) => toggleModal(true, subcategory)}
              deleteEndpoint='/subcategories'
              archiveEndpoint='/subcategories'
              refetch={refetch}
              searchableColumns={[
                { id: 'name', title: 'Subcategory Name' },
                { id: 'categoryName', title: 'Category Name' },
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
                  options: (categories?.data || [])
                    .filter((category) => category && category.id)
                    .map((category) => ({
                      label: category.name,
                      value: category.id,
                    })),
                },
              ]}
              excludeColumns={[
                'createdAt',
                'updatedAt',
                'id',
                'categoryId',
                'category',
              ]}
              pageSize={10}
              columnFormatters={{
                categoryName: (value) => (
                  <span className='font-medium'>{value}</span>
                ),
              }}
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
