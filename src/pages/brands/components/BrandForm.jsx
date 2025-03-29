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
  name: z.string().min(1, { message: 'Brand name is required' }),
  logo: z.string().optional(),
  description: z.string().optional(),
})

export default function BrandForm({ onCancel, refetch, brand }) {
  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: brand?.name || '',
      logo: brand?.logo || '',
      description: brand?.description || '',
    },
  })

  // Update form values when brand prop changes
  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name || '',
        logo: brand.logo || '',
        description: brand.description || '',
      })
    }
  }, [brand, form])

  const { mutate, isLoading } = useMutationData(
    () => {
      toast.success('Success', {
        description: `Brand ${brand ? 'updated' : 'created'} successfully!`,
      })

      refetch?.()
      onCancel()
    },
    (error) => {
      toast.error('Error', {
        description:
          error?.response?.data?.message ||
          `Failed to ${brand ? 'update' : 'create'} brand!`,
      })
    }
  )

  const onSubmit = (values) => {
    if (brand && brand.id) {
      // Update existing brand - use PATCH
      mutate({
        method: 'patch',
        url: `/brand/${brand.id}`,
        data: values,
      })
    } else {
      // Create new brand - use POST
      mutate({
        method: 'post',
        url: '/brand/create-brand',
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
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter brand name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='logo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder='Enter logo URL' {...field} />
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
                <Input placeholder='Enter brand description' {...field} />
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
                {brand ? 'Updating...' : 'Saving...'}
              </div>
            ) : brand ? (
              'Update Brand'
            ) : (
              'Save Brand'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
