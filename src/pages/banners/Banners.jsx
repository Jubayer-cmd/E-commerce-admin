import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import Modal from '@/components/custom/modal'
import BannerForm from './components/BannerForm'
import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'
import Loading from '../../components/custom/loading'

export default function Banners() {
  const [modalState, setModalState] = useState({ isOpen: false, banner: null })

  const {
    data: banners = [],
    isLoading,
    refetch,
  } = useFetchData('banners', '/banner/', {}, true)

  // Single function to manage modal state
  const toggleModal = (isOpen, banner = null) =>
    setModalState({ isOpen, banner })

  const modalTitle = modalState.banner ? 'Edit Banner' : 'Create New Banner'
  const modalDescription = modalState.banner
    ? 'Update banner information'
    : 'Add a new banner to your website'

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Banners</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <Button onClick={() => toggleModal(true)}>Create Banner</Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <Loading />
          ) : (
            <ReusableTable
              data={banners.data || []}
              onEdit={(banner) => toggleModal(true, banner)}
              deleteEndpoint='/banner'
              archiveEndpoint='/banner'
              refetch={refetch}
              searchableColumns={[{ id: 'title', title: 'Banner Title' }]}
              filterableColumns={[
                {
                  id: 'type',
                  title: 'Type',
                  options: [
                    { label: 'Homepage', value: 'homepage' },
                    { label: 'Category', value: 'category' },
                    { label: 'Promotion', value: 'promotion' },
                    { label: 'Seasonal', value: 'seasonal' },
                  ],
                },
                {
                  id: 'isActive',
                  title: 'Status',
                  options: [
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                  ],
                },
              ]}
              excludeColumns={['createdAt', 'updatedAt', 'id']}
              pageSize={10}
              imageColumns={[
                {
                  id: 'image',
                  title: 'Image',
                  imgStyle: {
                    width: '100px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  },
                },
              ]}
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
        <BannerForm
          onCancel={() => toggleModal(false)}
          refetch={refetch}
          banner={modalState.banner}
        />
      </Modal>
    </Layout>
  )
}
