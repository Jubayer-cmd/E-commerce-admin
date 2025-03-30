import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useMutationData from '@/hooks/apis/useMutationData'
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
import { toast } from 'sonner'
import { IconLoader2 } from '@tabler/icons-react'

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
  description: z.string().optional(),
})

export default function CategoryForm({ onCancel, refetch, category }) {
  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  })

  // Update form values when category prop changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || '',
        description: category.description || '',
      })
    }
  }, [category, form])

  const { mutate, isLoading } = useMutationData(
    () => {
      toast.success('Success', {
        description: `Category ${category ? 'updated' : 'created'} successfully!`,
      })

      refetch?.()
      onCancel()
    },
    (error) => {
      toast.error('Error', {
        description:
          error?.response?.data?.message ||
          `Failed to ${category ? 'update' : 'create'} category!`,
      })
    }
  )

  const onSubmit = (values) => {
    if (category && category.id) {
      // Update existing category - use PATCH
      mutate({
        method: 'patch',
        url: `/categories/${category.id}`,
        data: values,
      })
    } else {
      // Create new category - use POST
      mutate({
        method: 'post',
        url: '/categories/create-category',
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
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter category name' {...field} />
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
                <Input placeholder='Enter category description' {...field} />
              </FormControl>
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
                {category ? 'Updating...' : 'Saving...'}
              </div>
            ) : category ? (
              'Update Category'
            ) : (
              'Save Category'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
