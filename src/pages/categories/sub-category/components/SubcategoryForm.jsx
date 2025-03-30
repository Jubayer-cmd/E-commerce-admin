import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useMutationData from '@/hooks/apis/useMutationData'
import useFetchData from '@/hooks/apis/useFetchData'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { IconLoader2 } from '@tabler/icons-react'

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, { message: 'Subcategory name is required' }),
  description: z.string().optional(),
  categoryId: z.string().min(1, { message: 'Category is required' }),
})

export default function SubcategoryForm({ onCancel, refetch, subcategory }) {
  // Fetch categories for the dropdown
  const { data: categoriesData } = useFetchData(
    'categories',
    '/categories/',
    {},
    true
  )

  // Correctly access the categories array
  const categories = categoriesData?.data || []

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subcategory?.name || '',
      description: subcategory?.description || '',
      categoryId: subcategory?.categoryId || '',
    },
  })

  // Update form values when subcategory prop changes
  useEffect(() => {
    if (subcategory) {
      form.reset({
        name: subcategory.name || '',
        description: subcategory.description || '',
        categoryId: subcategory.categoryId || '',
      })
    }
  }, [subcategory, form])

  const { mutate, isLoading } = useMutationData(
    () => {
      toast.success('Success', {
        description: `Subcategory ${subcategory ? 'updated' : 'created'} successfully!`,
      })

      refetch?.()
      onCancel()
    },
    (error) => {
      toast.error('Error', {
        description:
          error?.response?.data?.message ||
          `Failed to ${subcategory ? 'update' : 'create'} subcategory!`,
      })
    }
  )

  const onSubmit = (values) => {
    if (subcategory && subcategory.id) {
      // Update existing subcategory
      mutate({
        method: 'patch',
        url: `/subcategories/${subcategory.id}`,
        data: values,
      })
    } else {
      // Create new subcategory
      mutate({
        method: 'post',
        url: '/subcategories/create-subcategory',
        data: values,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter subcategory name' {...field} />
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
                <Input placeholder='Enter subcategory description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
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

        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center'>
                <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                {subcategory ? 'Updating...' : 'Saving...'}
              </div>
            ) : subcategory ? (
              'Update Subcategory'
            ) : (
              'Save Subcategory'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
