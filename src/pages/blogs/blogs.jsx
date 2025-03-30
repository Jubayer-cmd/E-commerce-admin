import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import Modal from '@/components/custom/modal'
import BlogForm from './components/BlogForm'
import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'
import Loading from '../../components/custom/loading'

export default function Blogs() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    blog: null,
  })

  const {
    data: blogs = [],
    isLoading,
    refetch,
  } = useFetchData('blogs', '/blogs/', {}, true)

  // Modal state management
  const toggleModal = (isOpen, blog = null) => setModalState({ isOpen, blog })

  const modalTitle = modalState.blog ? 'Edit Blog' : 'Create New Blog'
  const modalDescription = modalState.blog
    ? 'Update blog information'
    : 'Add a new blog post'

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Blogs</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <Button onClick={() => toggleModal(true)}>Create a new Blog</Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <Loading />
          ) : (
            <ReusableTable
              data={blogs.data || []}
              onEdit={(blog) => toggleModal(true, blog)}
              deleteEndpoint='/blogs'
              archiveEndpoint='/blogs'
              refetch={refetch}
              searchableColumns={[
                { id: 'title', title: 'Blog Title' },
                { id: 'authorName', title: 'Author' },
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
              ]}
              excludeColumns={[
                'createdAt',
                'updatedAt',
                'id',
                'authorId',
                'content', // Content will be too large to display in the table
              ]}
              pageSize={10}
              imageColumns={[
                {
                  id: 'image',
                  imgStyle: {
                    width: '100px',
                    height: '60px',
                    objectFit: 'cover',
                  },
                },
              ]}
              columnFormatters={{
                title: (value) => (
                  <span className='font-semibold'>{value}</span>
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
        size='lg'
      >
        <BlogForm
          onCancel={() => toggleModal(false)}
          refetch={refetch}
          blog={modalState.blog}
        />
      </Modal>
    </Layout>
  )
}
