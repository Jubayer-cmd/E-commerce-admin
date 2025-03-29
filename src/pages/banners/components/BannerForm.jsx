import { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ImageInput from '@/components/ui/ImageInput'
import { toast } from 'sonner'
import { IconLoader2 } from '@tabler/icons-react'

const formSchema = z.object({
  title: z.string().min(1, { message: 'Banner title is required' }),
  image: z.any(),
  type: z.string().min(1, { message: 'Banner type is required' }),
})

export default function BannerForm({ onCancel, refetch, banner }) {
  const [previewUrl, setPreviewUrl] = useState('')

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: banner?.title || '',
      image: undefined,
      type: banner?.type || '',
    },
  })

  useEffect(() => {
    if (banner) {
      form.reset({
        title: banner.title || '',
        image: undefined,
        type: banner.type || '',
      })

      if (banner.image) {
        setPreviewUrl(banner.image)
      }
    }
  }, [banner, form])

  // Just ensure we're using the consistent pattern
  const { mutate, isLoading } = useMutationData(
    () => {
      toast.success('Success', {
        description: `Banner ${banner ? 'updated' : 'created'} successfully!`,
      })

      refetch?.()
      onCancel()
    },
    (error) => {
      toast.error('Error', {
        description:
          error?.response?.data?.message ||
          `Failed to ${banner ? 'update' : 'create'} banner!`,
      })
    }
  )

  const onSubmit = (values) => {
    // Create FormData object to handle file upload
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('type', values.type)

    // Only append file if a new one is selected
    if (values.image instanceof File) {
      formData.append('image', values.image)
    } else if (banner?.image && previewUrl) {
      // If editing and no new file selected, pass the existing image URL
      formData.append('imageUrl', banner.image)
    }

    if (banner && banner.id) {
      // Update existing banner - use PATCH with FormData
      mutate({
        method: 'patch',
        url: `/banner/${banner.id}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } else {
      // Create new banner - use POST with FormData
      mutate({
        method: 'post',
        url: '/banner/create-banner',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter banner title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='image'
          render={({ field: { ...field } }) => (
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <FormControl>
                <ImageInput
                  onChange={(file) => {
                    form.setValue('image', file)
                  }}
                  previewUrl={previewUrl}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select banner type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='homepage'>Homepage</SelectItem>
                  <SelectItem value='category'>Category</SelectItem>
                  <SelectItem value='promotion'>Promotion</SelectItem>
                  <SelectItem value='seasonal'>Seasonal</SelectItem>
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
                {banner ? 'Updating...' : 'Saving...'}
              </div>
            ) : banner ? (
              'Update Banner'
            ) : (
              'Save Banner'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
