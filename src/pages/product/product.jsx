import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'
import Loading from '../../components/custom/loading'
import { Button } from '@/components/ui/button'
import Modal from '@/components/custom/modal'
import ProductForm from './components/ProductForm'

export default function Product() {
  // Use a single state object for modal state management
  const [modalState, setModalState] = useState({
    isOpen: false,
    product: null,
  })

  const {
    data: products = [],
    isLoading,
    refetch,
  } = useFetchData('products', '/products/', {}, true)

  // Toggle modal with optional product data
  const toggleModal = (isOpen, product = null) =>
    setModalState({ isOpen, product })

  const modalTitle = modalState.product ? 'Edit Product' : 'Create New Product'
  const modalDescription = modalState.product
    ? 'Update product information'
    : 'Add a new product to your store'

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Products</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <Button onClick={() => toggleModal(true)}>Create a Product</Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <Loading />
          ) : (
            <ReusableTable
              data={products.data || []}
              onEdit={(product) => toggleModal(true, product)}
              archiveEndpoint='/products'
              refetch={refetch}
              searchableColumns={[
                { id: 'name', title: 'Name' },
                { id: 'description', title: 'Description' },
                { id: 'sku', title: 'SKU' },
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
                  id: 'hasVariants',
                  title: 'Has Variants',
                  options: [
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ],
                },
                {
                  id: 'categoryId',
                  title: 'Category',
                  options: [], // This would be populated with actual categories
                },
              ]}
              excludeColumns={[
                'createdAt',
                'updatedAt',
                'id',
                'brandId',
                'categoryId',
                'subCategoryId',
                'unitId',
                'description',
                'images',
              ]}
              pageSize={10}
            />
          )}
        </div>
      </Layout.Body>

      {/* Render Modal separately from the rest of the UI */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => toggleModal(false)}
        title={modalTitle}
        description={modalDescription}
        size='lg'
      >
        <ProductForm
          onCancel={() => toggleModal(false)}
          refetch={refetch}
          product={modalState.product}
        />
      </Modal>
    </Layout>
  )
}
