import { Layout } from '@/components/custom/layout'
import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'
import Loading from '../../components/custom/loading'
//TODO: fix the search and filter
export default function Users() {
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useFetchData('users', '/user/', {}, true)

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Users</h1>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <Loading />
          ) : (
            <ReusableTable
              data={users.data || []}
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
