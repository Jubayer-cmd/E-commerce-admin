import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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

export default function GeneralSection({
  form,
  categories,
  subCategories,
  brands,
  units,
  hasVariants,
  setHasVariants,
}) {
  return (
    <div className='space-y-4'>
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
                onValueChange={(value) => {
                  field.onChange(value)
                  // Reset subcategory when category changes
                  form.setValue('subCategoryId', '')
                }}
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
          name='subCategoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                disabled={!form.watch('categoryId')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select sub-category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subCategories?.data
                    ?.filter(
                      (subCat) => subCat.categoryId === form.watch('categoryId')
                    )
                    .map((subCategory) => (
                      <SelectItem key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
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

      <div className='space-y-4'>
        <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
          <FormControl>
            <Checkbox checked={hasVariants} onCheckedChange={setHasVariants} />
          </FormControl>
          <FormLabel className='font-normal'>
            This product has multiple variants
          </FormLabel>
        </FormItem>
      </div>
    </div>
  )
}
