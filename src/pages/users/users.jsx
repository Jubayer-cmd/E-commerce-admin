import { Layout } from '@/components/custom/layout'
import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'
import Loading from '../../components/custom/loading'
import { useState } from 'react'

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useFetchData('users', '/user/', {}, true)

  // Function to handle search manually if the ReusableTable search isn't working
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  // Filter data based on search term
  const filteredData = users.data
    ? users.data.filter((user) => {
        if (!searchTerm) return true

        return (
          (user.name && user.name.toLowerCase().includes(searchTerm)) ||
          (user.email && user.email.toLowerCase().includes(searchTerm)) ||
          (user.phone && user.phone.toLowerCase().includes(searchTerm))
        )
      })
    : []

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Users</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <input
            type='text'
            placeholder='Search by name, email, or phone'
            className='rounded-md border px-4 py-2'
            onChange={handleSearch}
          />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <Loading />
          ) : (
            <ReusableTable
              data={searchTerm ? filteredData : users.data || []}
              archiveEndpoint='/user'
              refetch={refetch}
              searchableColumns={[
                { id: 'name', title: 'Name' },
                { id: 'email', title: 'Email' },
                { id: 'phone', title: 'Phone' },
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
                  id: 'role',
                  title: 'Role',
                  options: [
                    { label: 'Admin', value: 'admin' },
                    { label: 'User', value: 'user' },
                    { label: 'Vendor', value: 'vendor' },
                    { label: 'Moderator', value: 'moderator' },
                    { label: 'Customer', value: 'customer' },
                  ],
                },
              ]}
              excludeColumns={[
                'createdAt',
                'updatedAt',
                'id',
                'password',
                'image',
              ]}
              pageSize={10}
            />
          )}
        </div>
      </Layout.Body>
    </Layout>
  )
}
