// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useForm } from 'react-hook-form'
// import { Layout } from '@/components/custom/layout'
// import { Button } from '@/components/ui/button'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Checkbox } from '@/components/ui/checkbox'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// // import { Separator } from '@/components/ui/separator'
// import { toast } from 'sonner'
// import useFetchData from '@/hooks/apis/useFetchData'
// import { IconPlus, IconTrash } from '@tabler/icons-react'
// import useMutationData from '@/hooks/apis/useMutationData'

// export default function AddProduct() {
//   const navigate = useNavigate()
//   const [hasVariants, setHasVariants] = useState(false)
//   const [variants, setVariants] = useState([])
//   const { isLoading, mutateAsync } = useMutationData('/products/create-product')

//   // Fetch categories, brands, and units
//   const { data: categories = [] } = useFetchData(
//     'categories',
//     '/categories',
//     {},
//     true
//   )
//   const { data: brands = [] } = useFetchData('brands', '/brands', {}, true)
//   const { data: units = [] } = useFetchData('units', '/units', {}, true)

//   const form = useForm({
//     defaultValues: {
//       name: '',
//       description: '',
//       price: '',
//       comparePrice: '',
//       stockQuantity: '',
//       sku: '',
//       categoryId: '',
//       brandId: '',
//       unitId: '',
//       hasVariants: false,
//     },
//   })

//   const addVariant = () => {
//     setVariants([
//       ...variants,
//       {
//         sku: '',
//         name: '',
//         price: '',
//         comparePrice: '',
//         stockQuantity: '',
//         isDefault: variants.length === 0,
//         attributes: {},
//         images: [],
//       },
//     ])
//   }

//   const removeVariant = (index) => {
//     const newVariants = [...variants]
//     newVariants.splice(index, 1)
//     setVariants(newVariants)

//     // If any variant was default and we removed it, make first one default if exists
//     if (newVariants.length > 0 && !newVariants.some((v) => v.isDefault)) {
//       newVariants[0].isDefault = true
//     }
//   }

//   const updateVariant = (index, field, value) => {
//     const newVariants = [...variants]
//     newVariants[index][field] = value
//     setVariants(newVariants)
//   }

//   const setDefaultVariant = (index) => {
//     const newVariants = [...variants].map((v, i) => ({
//       ...v,
//       isDefault: i === index,
//     }))
//     setVariants(newVariants)
//   }

//   const onSubmit = async (data) => {
//     try {
//       // Format the data
//       const formattedData = {
//         ...data,
//         price: parseFloat(data.price),
//         comparePrice: data.comparePrice
//           ? parseFloat(data.comparePrice)
//           : undefined,
//         stockQuantity: data.stockQuantity
//           ? parseInt(data.stockQuantity, 10)
//           : undefined,
//         hasVariants: hasVariants,
//       }

//       // Add variants if any
//       if (hasVariants && variants.length > 0) {
//         formattedData.variants = variants.map((v) => ({
//           ...v,
//           price: parseFloat(v.price),
//           comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : undefined,
//           stockQuantity: parseInt(v.stockQuantity, 10),
//         }))
//       }

//       await mutateAsync(formattedData)
//       toast.success('Product created successfully')
//       navigate('/products')
//     } catch (error) {
//       toast.error(
//         'Failed to create product: ' +
//           (error.response?.data?.message || error.message)
//       )
//     }
//   }

//   return (
//     <Layout>
//       <Layout.Header sticky>
//         <h1 className='text-2xl font-bold'>Add New Product</h1>
//       </Layout.Header>

//       <Layout.Body>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className='space-y-8 px-4 py-6'
//           >
//             <Card>
//               <CardHeader>
//                 <CardTitle>Product Information</CardTitle>
//                 <CardDescription>
//                   Enter the basic information about your product
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className='space-y-4'>
//                 <FormField
//                   control={form.control}
//                   name='name'
//                   rules={{ required: 'Name is required' }}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder='Product name' {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name='description'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Description</FormLabel>
//                       <FormControl>
//                         <Textarea
//                           placeholder='Product description'
//                           className='min-h-[100px]'
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
//                   <FormField
//                     control={form.control}
//                     name='price'
//                     rules={{
//                       required: 'Price is required',
//                       pattern: {
//                         value: /^\d+(\.\d{1,2})?$/,
//                         message: 'Enter a valid price',
//                       },
//                     }}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Price</FormLabel>
//                         <FormControl>
//                           <Input
//                             type='number'
//                             min='0'
//                             step='0.01'
//                             placeholder='0.00'
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name='comparePrice'
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Compare Price (Optional)</FormLabel>
//                         <FormControl>
//                           <Input
//                             type='number'
//                             min='0'
//                             step='0.01'
//                             placeholder='0.00'
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
//                   <FormField
//                     control={form.control}
//                     name='sku'
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>SKU (Optional)</FormLabel>
//                         <FormControl>
//                           <Input placeholder='Stock keeping unit' {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name='stockQuantity'
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Stock Quantity</FormLabel>
//                         <FormControl>
//                           <Input
//                             type='number'
//                             min='0'
//                             placeholder='0'
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
//                   <FormField
//                     control={form.control}
//                     name='categoryId'
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Category</FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder='Select category' />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {categories?.data?.map((category) => (
//                               <SelectItem key={category.id} value={category.id}>
//                                 {category.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name='brandId'
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Brand (Optional)</FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder='Select brand' />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {brands?.data?.map((brand) => (
//                               <SelectItem key={brand.id} value={brand.id}>
//                                 {brand.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name='unitId'
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Unit (Optional)</FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder='Select unit' />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {units?.data?.map((unit) => (
//                               <SelectItem key={unit.id} value={unit.id}>
//                                 {unit.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <FormItem className='mt-4 flex flex-row items-center space-x-3 space-y-0'>
//                   <FormControl>
//                     <Checkbox
//                       checked={hasVariants}
//                       onCheckedChange={setHasVariants}
//                     />
//                   </FormControl>
//                   <FormLabel className='font-normal'>
//                     This product has multiple variants
//                   </FormLabel>
//                 </FormItem>
//               </CardContent>
//             </Card>

//             {hasVariants && (
//               <Card>
//                 <CardHeader className='flex flex-row items-center justify-between'>
//                   <div>
//                     <CardTitle>Product Variants</CardTitle>
//                     <CardDescription>
//                       Manage different versions of this product
//                     </CardDescription>
//                   </div>
//                   <Button
//                     type='button'
//                     onClick={addVariant}
//                     variant='outline'
//                     size='sm'
//                   >
//                     <IconPlus size={16} className='mr-1' /> Add Variant
//                   </Button>
//                 </CardHeader>
//                 <CardContent className='space-y-6'>
//                   {variants.length === 0 ? (
//                     <div className='py-6 text-center text-muted-foreground'>
//                       <p>
//                         {
//                           'No variants added. Click "Add Variant" to create one.'
//                         }
//                       </p>
//                     </div>
//                   ) : (
//                     variants.map((variant, index) => (
//                       <div key={index} className='rounded-lg border p-4'>
//                         <div className='mb-4 flex items-center justify-between'>
//                           <div className='font-medium'>
//                             Variant #{index + 1}
//                           </div>
//                           <div className='flex items-center gap-2'>
//                             <div className='flex items-center'>
//                               <input
//                                 type='radio'
//                                 checked={variant.isDefault}
//                                 onChange={() => setDefaultVariant(index)}
//                                 className='mr-2'
//                               />
//                               <span className='text-sm text-muted-foreground'>
//                                 Default
//                               </span>
//                             </div>
//                             <Button
//                               type='button'
//                               variant='ghost'
//                               size='icon'
//                               onClick={() => removeVariant(index)}
//                             >
//                               <IconTrash size={16} />
//                             </Button>
//                           </div>
//                         </div>

//                         <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
//                           <div>
//                             <FormLabel>Variant Name</FormLabel>
//                             <Input
//                               value={variant.name}
//                               onChange={(e) =>
//                                 updateVariant(index, 'name', e.target.value)
//                               }
//                               placeholder='e.g. Red XL'
//                               required
//                             />
//                           </div>
//                           <div>
//                             <FormLabel>SKU</FormLabel>
//                             <Input
//                               value={variant.sku}
//                               onChange={(e) =>
//                                 updateVariant(index, 'sku', e.target.value)
//                               }
//                               placeholder='Stock keeping unit'
//                               required
//                             />
//                           </div>
//                         </div>

//                         <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
//                           <div>
//                             <FormLabel>Price</FormLabel>
//                             <Input
//                               type='number'
//                               min='0'
//                               step='0.01'
//                               value={variant.price}
//                               onChange={(e) =>
//                                 updateVariant(index, 'price', e.target.value)
//                               }
//                               placeholder='0.00'
//                               required
//                             />
//                           </div>
//                           <div>
//                             <FormLabel>Compare Price</FormLabel>
//                             <Input
//                               type='number'
//                               min='0'
//                               step='0.01'
//                               value={variant.comparePrice}
//                               onChange={(e) =>
//                                 updateVariant(
//                                   index,
//                                   'comparePrice',
//                                   e.target.value
//                                 )
//                               }
//                               placeholder='0.00'
//                             />
//                           </div>
//                           <div>
//                             <FormLabel>Stock Quantity</FormLabel>
//                             <Input
//                               type='number'
//                               min='0'
//                               value={variant.stockQuantity}
//                               onChange={(e) =>
//                                 updateVariant(
//                                   index,
//                                   'stockQuantity',
//                                   e.target.value
//                                 )
//                               }
//                               placeholder='0'
//                               required
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <FormLabel>Attributes</FormLabel>
//                           <Textarea
//                             value={JSON.stringify(variant.attributes)}
//                             onChange={(e) => {
//                               try {
//                                 const parsed = JSON.parse(e.target.value)
//                                 updateVariant(index, 'attributes', parsed)
//                               } catch (error) {
//                                 // Handle invalid JSON
//                                 console.log(error)
//                                 updateVariant(index, 'attributes', {})
//                               }
//                             }}
//                             placeholder='{"color": "red", "size": "XL"}'
//                           />
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             <div className='flex justify-end space-x-2'>
//               <Button
//                 type='button'
//                 variant='outline'
//                 onClick={() => navigate('/products')}
//               >
//                 Cancel
//               </Button>
//               <Button type='submit' disabled={isLoading}>
//                 {isLoading ? 'Creating...' : 'Create Product'}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </Layout.Body>
//     </Layout>
//   )
// }
