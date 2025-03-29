import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import Modal from '@/components/custom/modal'
import BrandForm from './components/BrandForm'
import { ReusableTable } from '@/components/table/ReusableTable'
import { toast } from '@/hooks/use-toast'
import { useAxiosSecure } from '@/hooks/apis/useAxios'

export default function Brands() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const axiosSecure = useAxiosSecure()
  // Fetch brands from your API
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true)
      try {
        // Replace with your actual API call
        const response = await axiosSecure.get('/brand/')
        setBrands(response.data.data)
      } catch (error) {
        console.error('Error fetching brands:', error)
        toast({
          title: 'Error',
          description: 'Failed to load brands',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [refreshTrigger, axiosSecure])

  const handleEdit = (brand) => {
    setSelectedBrand(brand)
    setIsModalOpen(true)
  }

  const handleDelete = async (brand) => {
    if (confirm(`Are you sure you want to delete ${brand.name}?`)) {
      try {
        // Replace with your actual API call
        const response = await fetch(`/api/brands/${brand.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Brand deleted successfully',
          })
          // Refresh the brands list
          setRefreshTrigger((prev) => prev + 1)
        } else {
          throw new Error('Failed to delete brand')
        }
      } catch (error) {
        console.error('Error deleting brand:', error)
        toast({
          title: 'Error',
          description: 'Failed to delete brand',
          variant: 'destructive',
        })
      }
    }
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
    // Trigger a refresh
    setRefreshTrigger((prev) => prev + 1)
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
          {loading ? (
            <div className='flex h-64 items-center justify-center'>
              <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-primary'></div>
            </div>
          ) : (
            <ReusableTable
              data={brands}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchableColumns={[{ id: 'name', title: 'Brand Name' }]}
              filterableColumns={[
                {
                  id: 'status',
                  title: 'Status',
                  options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ],
                },
              ]}
              excludeColumns={['createdAt', 'updatedAt']} // Columns to exclude from the table
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
