import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'

export default function Subcategory() {
  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Sub-Category</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <Button>Create a new Sub-Category</Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {/* <DataTable data={tasks} columns={columns} /> */}
          <p>hey how are you?</p>
        </div>
      </Layout.Body>
    </Layout>
  )
}
