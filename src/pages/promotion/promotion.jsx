import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import Modal from '@/components/custom/modal'

import { ReusableTable } from '@/components/table/ReusableTable'
import useFetchData from '@/hooks/apis/useFetchData'
import Loading from '../../components/custom/loading'
import PromotionForm from './components/PromotionForm'

export default function Promotion() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    promotion: null,
  })

  const {
    data: promotions = [],
    isLoading,
    refetch,
  } = useFetchData('promotions', '/promotion/', {}, true)

  const toggleModal = (isOpen, promotion = null) =>
    setModalState({ isOpen, promotion })

  const modalTitle = modalState.promotion
    ? 'Edit Promotion'
    : 'Create New Promotion'
  const modalDescription = modalState.promotion
    ? 'Update promotion information'
    : 'Add a new promotion to your store'

  return (
    <Layout>
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold'>Promotions</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <Button onClick={() => toggleModal(true)}>Create Promotion</Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <Loading />
          ) : (
            <ReusableTable
              data={promotions.data || []}
              onEdit={(promotion) => toggleModal(true, promotion)}
              deleteEndpoint='/promotions'
              archiveEndpoint='/promotions'
              refetch={refetch}
              dateColumns={['startDate', 'endDate', 'createdAt', 'updatedAt']}
              searchableColumns={[
                { id: 'name', title: 'Promotion Name' },
                { id: 'code', title: 'Code' },
              ]}
              filterableColumns={[
                {
                  id: 'type',
                  title: 'Type',
                  options: [
                    { label: 'Discount', value: 'discount' },
                    { label: 'Flash Sale', value: 'flash_sale' },
                    { label: 'Seasonal Offer', value: 'seasonal_offer' },
                    { label: 'Bundle Deal', value: 'bundle_deal' },
                    { label: 'BOGO', value: 'bogo' },
                    { label: 'Free Shipping', value: 'free_shipping' },
                    { label: 'New Customer', value: 'new_customer' },
                    { label: 'Loyalty Reward', value: 'loyalty_reward' },
                  ],
                },
                {
                  id: 'discountType',
                  title: 'Discount Type',
                  options: [
                    { label: 'Percentage', value: 'percentage' },
                    { label: 'Fixed Amount', value: 'fixed_amount' },
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
              excludeColumns={[
                'updatedAt',
                'id',
                'conditions',
                'appliedProducts',
                'appliedCategories',
                'usages',
                'createdAt',
                // '_count', // Add _count to excluded columns
              ]}
              formatColumnValue={{
                discount: (value, row) =>
                  row.discountType === 'percentage' ? `${value}%` : `$${value}`,
              }}
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
        size='lg'
      >
        <PromotionForm
          onCancel={() => toggleModal(false)}
          refetch={refetch}
          promotion={modalState.promotion}
        />
      </Modal>
    </Layout>
  )
}
