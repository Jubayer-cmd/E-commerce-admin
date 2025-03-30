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

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, { message: 'Blog title is required' }),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters' }),
  image: z.string().optional(),
  // In a real app, you might not need to set authorId/authorName manually
  // as it could be derived from the authenticated user
  authorName: z.string().min(1, { message: 'Author name is required' }),
})

export default function BlogForm({ onCancel, refetch, blog }) {
  const [uploading, setUploading] = useState(false)

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog?.title || '',
      content: blog?.content || '',
      image: blog?.image || '',
      authorName: blog?.authorName || '',
    },
  })

  // Update form values when blog prop changes
  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title || '',
        content: blog.content || '',
        image: blog.image || '',
        authorName: blog.authorName || '',
      })
    }
  }, [blog, form])

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
    if (blog && blog.id) {
      // Update existing blog
      mutate({
        method: 'patch',
        url: `/blogs/${blog.id}`,
        data: values,
      })
    } else {
      // Create new blog
      mutate({
        method: 'post',
        url: '/blogs',
        data: values,
      })
    }
  }

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)

    try {
      // Replace with your actual image upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.url) {
        form.setValue('image', data.url)
        toast.success('Image uploaded successfully')
        return data.url
      }
    } catch (error) {
      toast.error('Failed to upload image')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
    return null
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <ImageInput
                  previewUrl={field.value}
                  onChange={async (file) => {
                    if (file) {
                      const uploadedUrl = await handleImageUpload(file)
                      if (uploadedUrl) {
                        field.onChange(uploadedUrl)
                      }
                    }
                  }}
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
