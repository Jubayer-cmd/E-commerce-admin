import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import Modal from '@/components/custom/modal'
import ProductForm from './components/ProductForm'
import { columns } from './components/columns' // You'd create this file with product columns
import ReusableDataTable from '@/components/custom/data-table'
import { useCategories } from '@/hooks/useCategories' // Example of a custom hook

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [filterCategory, setFilterCategory] = useState('')
  const { categories } = useCategories() // Example of fetching categories for filtering

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setRefreshTrigger((prev) => prev + 1)
  }

  // Example filter params using category ID
  const filterParams = filterCategory ? { categoryId: filterCategory } : {}

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Products</h1>
        <div className='ml-auto flex items-center space-x-4'>
          {/* Example of a filter element */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className='rounded border p-2'
          >
            <option value=''>All Categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Button onClick={handleOpenModal}>Create Product</Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <ReusableDataTable
            endpoint='/products/'
            columns={columns}
            dataPath='data.products' // Example of a nested data path
            refreshTrigger={refreshTrigger}
            filterParams={filterParams} // Pass filter parameters
            onDataLoaded={(data) =>
              console.log('Products loaded:', data.length)
            }
          />
        </div>
      </Layout.Body>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title='Create New Product'
        description='Add a new product to your catalog'
      >
        <ProductForm onCancel={handleCloseModal} />
      </Modal>
    </Layout>
  )
}
