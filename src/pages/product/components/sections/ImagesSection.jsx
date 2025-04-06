import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormLabel } from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { IconTrash } from '@tabler/icons-react'

export default function ImagesSection({ productImages, setProductImages }) {
  const handleImageChange = (files) => {
    // Handle multiple image uploads
    const newImages = [...productImages]
    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i])
    }
    setProductImages(newImages)
  }

  const removeImage = (index) => {
    const newImages = [...productImages]
    newImages.splice(index, 1)
    setProductImages(newImages)
  }

  return (
    <Card>
      <CardContent className='pt-4'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <FormLabel>Product Images</FormLabel>
            <Input
              type='file'
              onChange={(e) => handleImageChange(e.target.files)}
              accept='image/*'
              multiple
              className='max-w-xs'
            />
          </div>

          <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-4'>
            {productImages.length > 0 ? (
              productImages.map((img, index) => (
                <div key={index} className='group relative'>
                  <img
                    src={
                      typeof img === 'string' ? img : URL.createObjectURL(img)
                    }
                    alt={`Product ${index + 1}`}
                    className='h-32 w-full rounded-md object-cover'
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100'
                    onClick={() => removeImage(index)}
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>
              ))
            ) : (
              <div className='col-span-full py-8 text-center text-muted-foreground'>
                No images added yet. Upload some images.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
