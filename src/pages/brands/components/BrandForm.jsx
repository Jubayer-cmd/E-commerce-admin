import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import usePostData from '@/hooks/apis/usePostData'
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
import Loading from '../../../components/custom/loading'

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

  const { mutate, isLoading } = usePostData(() => {
    toast({
      title: 'Success',
      description: `Brand ${brand ? 'updated' : 'created'} successfully!`,
    })

    refetch?.()
    onCancel()
  })

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
            {isLoading ? <Loading /> : brand ? 'Update Brand' : 'Save Brand'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
