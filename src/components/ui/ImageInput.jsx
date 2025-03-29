import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

export default function ImageInput({
  onChange,
  value,
  previewUrl: initialPreviewUrl,
  className,
  ...props
}) {
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl || '')

  useEffect(() => {
    if (initialPreviewUrl) {
      setPreviewUrl(initialPreviewUrl)
    }
  }, [initialPreviewUrl])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result)
      }
      fileReader.readAsDataURL(file)
      onChange(file)
    }
  }

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Input
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        {...props}
      />
      {previewUrl && (
        <div className='mt-2'>
          <p className='mb-1 text-sm text-muted-foreground'>Preview:</p>
          <img
            src={previewUrl}
            alt='Image preview'
            className='max-h-40 rounded-md border'
          />
        </div>
      )}
    </div>
  )
}
