import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import ImageInput from '@/components/ui/ImageInput'
import { useAuth } from '@/lib/utils'

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, { message: 'Blog title is required' }),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters' }),
  image: z.any(),
  authorName: z.string().min(1, { message: 'Author name is required' }),
  authorId: z.string().optional(),
})

export default function BlogForm({ onCancel, refetch, blog }) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const { user } = useAuth()

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog?.title || '',
      content: blog?.content || '',
      image: undefined,
      authorName: blog?.authorName || (user ? user.name : ''),
      authorId: blog?.authorId || (user ? user.id : ''),
    },
  })

  // Update form values when blog prop or user changes
  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title || '',
        content: blog.content || '',
        image: undefined,
        authorName: blog.authorName || (user ? user.name : ''),
        authorId: blog.authorId || (user ? user.id : ''),
      })

      if (blog.image) {
        setPreviewUrl(blog.image)
      }
    } else if (user) {
      // Update author fields if user is available but no blog is being edited
      form.setValue('authorName', user.name || '')
      form.setValue('authorId', user.id || '')
    }
  }, [blog, user, form])

  const { mutate, isLoading } = useMutationData(
    () => {
      toast.success('Success', {
        description: `Blog ${blog ? 'updated' : 'created'} successfully!`,
      })

      refetch?.()
      onCancel()
    },
    (error) => {
      toast.error('Error', {
        description:
          error?.response?.data?.message ||
          `Failed to ${blog ? 'update' : 'create'} blog!`,
      })
    }
  )

  const onSubmit = (values) => {
    // Create FormData object to handle file upload
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('content', values.content)
    formData.append('authorName', values.authorName)

    // Ensure authorId is set from the current user
    if (user && !values.authorId) {
      values.authorId = user.id
    }
    formData.append('authorId', values.authorId)

    // Remove the author connect object - not needed anymore

    // Only append file if a new one is selected
    if (values.image instanceof File) {
      formData.append('image', values.image)
    } else if (blog?.image && previewUrl) {
      // If editing and no new file selected, pass the existing image URL
      formData.append('imageUrl', blog.image)
    }

    if (blog && blog.id) {
      // Update existing blog
      mutate({
        method: 'patch',
        url: `/blogs/${blog.id}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } else {
      // Create new blog
      mutate({
        method: 'post',
        url: '/blogs/create-blogs',
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
              <FormLabel>Blog Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter blog title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Write your blog post here...'
                  {...field}
                  rows={8}
                  className='min-h-[200px]'
                />
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
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <ImageInput
                  previewUrl={previewUrl}
                  onChange={(file) => {
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file))
                      form.setValue('image', file)
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='authorName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder='Author name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading || uploading}>
            {isLoading ? (
              <div className='flex items-center'>
                <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                {blog ? 'Updating...' : 'Publishing...'}
              </div>
            ) : blog ? (
              'Update Blog'
            ) : (
              'Publish Blog'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
