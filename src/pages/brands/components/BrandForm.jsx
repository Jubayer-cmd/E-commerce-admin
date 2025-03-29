import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import usePostData from '@/hooks/apis/usePostData'

export default function BrandForm({ onCancel, onSuccess, brand }) {
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    logo: brand?.logo || '',
    description: brand?.description || '',
  })

  // Using usePostData hook with success callback
  const { mutate, isLoading } = usePostData(() => {
    toast({
      title: 'Success',
      description: brand
        ? 'Brand updated successfully!'
        : 'Brand created successfully!',
    })
    // Call onSuccess if provided, otherwise use onCancel
    if (onSuccess) {
      onSuccess()
    } else {
      onCancel()
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (brand?._id) {
      // Update existing brand
      mutate({
        method: 'patch',
        url: `/brand/${brand._id}`,
        data: formData,
      })
    } else {
      // Create new brand
      mutate({
        method: 'post',
        url: '/brand/create-brand',
        data: formData,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Brand Name</Label>
        <Input
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Enter brand name'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='logo'>Logo URL</Label>
        <Input
          id='logo'
          name='logo'
          value={formData.logo}
          onChange={handleChange}
          placeholder='Enter logo URL'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Input
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='Enter brand description'
        />
      </div>

      <div className='flex justify-end space-x-2 pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Saving...' : brand ? 'Update Brand' : 'Save Brand'}
        </Button>
      </div>
    </form>
  )
}
