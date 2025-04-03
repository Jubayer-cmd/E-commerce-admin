import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import useFetchData from '@/hooks/apis/useFetchData'
import { IconLoader2, IconPlus, IconTrash } from '@tabler/icons-react'
import useMutationData from '@/hooks/apis/useMutationData'
// import ImageInput from '@/components/ui/ImageInput'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

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
  const { data: brands = [] } = useFetchData('brands', '/brand', {}, true)
  const { data: units = [] } = useFetchData('units', '/units', {}, true)

  // Handle variant operations
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sku: '',
        name: '',
        price: '',
        comparePrice: '',
        stockQuantity: '',
        isDefault: variants.length === 0,
        attributes: {},
        images: [],
      },
    ])
  }

  const removeVariant = (index) => {
    const newVariants = [...variants]
    newVariants.splice(index, 1)
    setVariants(newVariants)

    // If any variant was default and we removed it, make first one default if exists
    if (newVariants.length > 0 && !newVariants.some((v) => v.isDefault)) {
      newVariants[0].isDefault = true
    }
  }

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index][field] = value
    setVariants(newVariants)
  }

  const setDefaultVariant = (index) => {
    const newVariants = [...variants].map((v, i) => ({
      ...v,
      isDefault: i === index,
    }))
    setVariants(newVariants)
  }

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

  const handleImageChange = (files) => {
    // Handle multiple image uploads
    const newImages = [...productImages]
    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i])
    }
    setProductImages(newImages)
  }

  const removeImage = (index) => {
    const newImages = [...productImages]
    newImages.splice(index, 1)
    setProductImages(newImages)
  }

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
            }))
          )
        )
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
            <FormField
              control={form.control}
              name='name'
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Product name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Product description'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='price'
                rules={{
                  required: 'Price is required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Enter a valid price',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='0'
                        step='0.01'
                        placeholder='0.00'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='comparePrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='0'
                        step='0.01'
                        placeholder='0.00'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='sku'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder='Stock keeping unit' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='stockQuantity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type='number' min='0' placeholder='0' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.data?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='brandId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select brand' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands?.data?.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='unitId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select unit' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units?.data?.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem className='mt-4 flex flex-row items-center space-x-3 space-y-0'>
              <FormControl>
                <Checkbox
                  checked={hasVariants}
                  onCheckedChange={setHasVariants}
                />
              </FormControl>
              <FormLabel className='font-normal'>
                This product has multiple variants
              </FormLabel>
            </FormItem>
          </TabsContent>

          <TabsContent value='images'>
            <Card>
              <CardContent className='pt-4'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Product Images</FormLabel>
                    <Input
                      type='file'
                      onChange={(e) => handleImageChange(e.target.files)}
                      accept='image/*'
                      multiple
                      className='max-w-xs'
                    />
                  </div>

                  <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-4'>
                    {productImages.length > 0 ? (
                      productImages.map((img, index) => (
                        <div key={index} className='group relative'>
                          <img
                            src={
                              typeof img === 'string'
                                ? img
                                : URL.createObjectURL(img)
                            }
                            alt={`Product ${index + 1}`}
                            className='h-32 w-full rounded-md object-cover'
                          />
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            className='absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100'
                            onClick={() => removeImage(index)}
                          >
                            <IconTrash size={16} />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className='col-span-full py-8 text-center text-muted-foreground'>
                        No images added yet. Upload some images.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {hasVariants && (
            <TabsContent value='variants'>
              <Card>
                <CardContent className='space-y-4 pt-4'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='text-lg'>Product Variants</FormLabel>
                    <Button
                      type='button'
                      onClick={addVariant}
                      variant='outline'
                      size='sm'
                    >
                      <IconPlus size={16} className='mr-1' /> Add Variant
                    </Button>
                  </div>

                  {variants.length === 0 ? (
                    <div className='py-6 text-center text-muted-foreground'>
                      <p>{`No variants added. Click "Add Variant" to create one.`}</p>
                    </div>
                  ) : (
                    <div className='space-y-6'>
                      {variants.map((variant, index) => (
                        <div key={index} className='rounded-lg border p-4'>
                          <div className='mb-4 flex items-center justify-between'>
                            <div className='font-medium'>
                              Variant #{index + 1}
                            </div>
                            <div className='flex items-center gap-2'>
                              <div className='flex items-center'>
                                <input
                                  type='radio'
                                  checked={variant.isDefault}
                                  onChange={() => setDefaultVariant(index)}
                                  className='mr-2'
                                />
                                <span className='text-sm text-muted-foreground'>
                                  Default
                                </span>
                              </div>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                onClick={() => removeVariant(index)}
                              >
                                <IconTrash size={16} />
                              </Button>
                            </div>
                          </div>

                          <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div>
                              <FormLabel>Variant Name</FormLabel>
                              <Input
                                value={variant.name}
                                onChange={(e) =>
                                  updateVariant(index, 'name', e.target.value)
                                }
                                placeholder='e.g. Red XL'
                                required
                              />
                            </div>
                            <div>
                              <FormLabel>SKU</FormLabel>
                              <Input
                                value={variant.sku}
                                onChange={(e) =>
                                  updateVariant(index, 'sku', e.target.value)
                                }
                                placeholder='Stock keeping unit'
                                required
                              />
                            </div>
                          </div>

                          <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <div>
                              <FormLabel>Price</FormLabel>
                              <Input
                                type='number'
                                min='0'
                                step='0.01'
                                value={variant.price}
                                onChange={(e) =>
                                  updateVariant(index, 'price', e.target.value)
                                }
                                placeholder='0.00'
                                required
                              />
                            </div>
                            <div>
                              <FormLabel>Compare Price</FormLabel>
                              <Input
                                type='number'
                                min='0'
                                step='0.01'
                                value={variant.comparePrice}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    'comparePrice',
                                    e.target.value
                                  )
                                }
                                placeholder='0.00'
                              />
                            </div>
                            <div>
                              <FormLabel>Stock Quantity</FormLabel>
                              <Input
                                type='number'
                                min='0'
                                value={variant.stockQuantity}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    'stockQuantity',
                                    e.target.value
                                  )
                                }
                                placeholder='0'
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <FormLabel>Attributes</FormLabel>
                            <Textarea
                              value={JSON.stringify(variant.attributes)}
                              onChange={(e) => {
                                try {
                                  const parsed = JSON.parse(e.target.value)
                                  updateVariant(index, 'attributes', parsed)
                                } catch (error) {
                                  // Handle invalid JSON silently
                                  console.log(error)
                                }
                              }}
                              placeholder='{"color": "red", "size": "XL"}'
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center'>
                <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                {product ? 'Updating...' : 'Creating...'}
              </div>
            ) : product ? (
              'Update Product'
            ) : (
              'Create Product'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
