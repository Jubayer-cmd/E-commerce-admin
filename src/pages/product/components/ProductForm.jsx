import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from 'sonner'
import useFetchData from '@/hooks/apis/useFetchData'
import { IconLoader2 } from '@tabler/icons-react'
import useMutationData from '@/hooks/apis/useMutationData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Import section components
import GeneralSection from './sections/GeneralSection'
import ImagesSection from './sections/ImagesSection'
import VariantsSection from './sections/VariantsSection'

export default function ProductForm({ onCancel, refetch, product }) {
  const [hasVariants, setHasVariants] = useState(false)
  const [variants, setVariants] = useState([])
  const [tab, setTab] = useState('general')
  const [productImages, setProductImages] = useState([])

  // Initialize form
  const form = useForm({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      comparePrice: product?.comparePrice || '',
      stockQuantity: product?.stockQuantity || '',
      sku: product?.sku || '',
      categoryId: product?.categoryId || '',
      subCategoryId: product?.subCategoryId || '',
      brandId: product?.brandId || '',
      unitId: product?.unitId || '',
    },
  })

  const { isLoading, mutate } = useMutationData(
    () => {
      toast.success(`Product ${product ? 'updated' : 'created'} successfully!`)
      refetch?.()
      onCancel()
    },
    (error) => {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${product ? 'update' : 'create'} product!`
      )
    }
  )

  // Fetch related data
  const { data: categories = [] } = useFetchData(
    'categories',
    '/categories',
    {},
    true
  )
  const { data: subCategories = [] } = useFetchData(
    'subCategories',
    '/sub-categories',
    {},
    true
  )
  const { data: brands = [] } = useFetchData('brands', '/brand', {}, true)
  const { data: units = [] } = useFetchData('units', '/units', {}, true)

  // Setup initial state if editing
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        stockQuantity: product.stockQuantity || '',
        sku: product.sku || '',
        categoryId: product.categoryId || '',
        subCategoryId: product.subCategoryId || '',
        brandId: product.brandId || '',
        unitId: product.unitId || '',
      })

      setHasVariants(product.hasVariants || false)

      if (product.images && product.images.length) {
        setProductImages(product.images)
      }

      if (product.variants && product.variants.length) {
        setVariants(product.variants)
      }
    }
  }, [product, form])

  const onSubmit = (data) => {
    try {
      // Format the data
      const formData = new FormData()

      // Add basic fields
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      formData.append('price', data.price)
      if (data.comparePrice) formData.append('comparePrice', data.comparePrice)
      if (data.stockQuantity)
        formData.append('stockQuantity', data.stockQuantity)
      if (data.sku) formData.append('sku', data.sku)
      if (data.categoryId) formData.append('categoryId', data.categoryId)
      if (data.subCategoryId)
        formData.append('subCategoryId', data.subCategoryId)
      if (data.brandId) formData.append('brandId', data.brandId)
      if (data.unitId) formData.append('unitId', data.unitId)
      formData.append('hasVariants', hasVariants)

      // Add product images
      productImages.forEach((img, index) => {
        if (typeof img === 'string') {
          formData.append(`existingImages[${index}]`, img)
        } else {
          formData.append('images', img)
        }
      })

      // Add variants if any
      if (hasVariants && variants.length > 0) {
        formData.append(
          'variants',
          JSON.stringify(
            variants.map((v) => ({
              ...v,
              price: parseFloat(v.price),
              comparePrice: v.comparePrice
                ? parseFloat(v.comparePrice)
                : undefined,
              stockQuantity: parseInt(v.stockQuantity, 10),
              // Ensure attributes is properly formatted as JSON
              attributes:
                typeof v.attributes === 'string'
                  ? JSON.parse(v.attributes)
                  : v.attributes || {},
            }))
          )
        )

        // Handle variant images
        variants.forEach((variant, index) => {
          if (variant.images && variant.images.length) {
            variant.images.forEach((img, imgIndex) => {
              if (typeof img !== 'string') {
                formData.append(`variantImages[${index}]`, img)
              } else {
                formData.append(
                  `existingVariantImages[${index}][${imgIndex}]`,
                  img
                )
              }
            })
          }
        })
      }

      if (product && product.id) {
        // Update existing product
        mutate({
          method: 'patch',
          url: `/products/${product.id}`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      } else {
        // Create new product
        mutate({
          method: 'post',
          url: '/products/create-product',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
    } catch (error) {
      toast.error('Error processing form: ' + error.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Tabs value={tab} onValueChange={setTab} className='w-full'>
          <TabsList className='mb-4'>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='images'>Images</TabsTrigger>
            {hasVariants && (
              <TabsTrigger value='variants'>Variants</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value='general' className='space-y-4'>
            <GeneralSection
              form={form}
              categories={categories}
              subCategories={subCategories}
              brands={brands}
              units={units}
              hasVariants={hasVariants}
              setHasVariants={setHasVariants}
            />
          </TabsContent>

          <TabsContent value='images'>
            <ImagesSection
              productImages={productImages}
              setProductImages={setProductImages}
            />
          </TabsContent>

          {hasVariants && (
            <TabsContent value='variants'>
              <VariantsSection variants={variants} setVariants={setVariants} />
            </TabsContent>
          )}
        </Tabs>

        <div className='flex justify-end space-x-2'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center'>
                <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                {product ? 'Updating...' : 'Saving...'}
              </div>
            ) : product ? (
              'Update Product'
            ) : (
              'Save Product'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
