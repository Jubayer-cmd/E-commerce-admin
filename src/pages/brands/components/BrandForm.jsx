import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAxiosSecure } from '@/hooks/apis/useAxios'
import { toast } from '@/hooks/use-toast'

export default function BrandForm({ onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const axiosSecure = useAxiosSecure()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axiosSecure.post('/brand/create-brand', formData)
      if (response.status === 201) {
        toast.success('Brand created successfully!')
        onCancel() // Close the form and refresh brands list
      }
    } catch (error) {
      console.error('Error creating brand:', error)
      toast.error(error.response?.data?.message || 'Failed to create brand')
    } finally {
      setIsLoading(false)
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
          {isLoading ? 'Saving...' : 'Save Brand'}
        </Button>
      </div>
    </form>
  )
}
