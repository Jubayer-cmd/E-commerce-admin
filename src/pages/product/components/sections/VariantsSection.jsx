import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormLabel } from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { IconPlus, IconTrash } from '@tabler/icons-react'

export default function VariantsSection({ variants, setVariants }) {
  // Handle variant operations
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sku: '',
        name: '',
        price: '',
        comparePrice: '',
        stockQuantity: '',
        isDefault: variants.length === 0,
        images: [],
      },
    ])
  }

  const removeVariant = (index) => {
    const newVariants = [...variants]
    newVariants.splice(index, 1)
    setVariants(newVariants)

    // If any variant was default and we       removed it, make first one default if exists
    if (newVariants.length > 0 && !newVariants.some((v) => v.isDefault)) {
      newVariants[0].isDefault = true
    }
  }

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index][field] = value
    setVariants(newVariants)
  }

  const setDefaultVariant = (index) => {
    const newVariants = [...variants].map((v, i) => ({
      ...v,
      isDefault: i === index,
    }))
    setVariants(newVariants)
  }

  return (
    <Card>
      <CardContent className='space-y-4 pt-4'>
        <div className='flex items-center justify-between'>
          <FormLabel className='text-lg'>Product Variants</FormLabel>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addVariant}
            className='flex items-center'
          >
            <IconPlus size={16} className='mr-1' />
            Add Variant
          </Button>
        </div>

        {variants.length === 0 ? (
          <div className='py-8 text-center text-muted-foreground'>
            {` No variants added yet. Click "Add Variant" to create one.`}
          </div>
        ) : (
          <div className='space-y-6'>
            {variants.map((variant, index) => (
              <div
                key={index}
                className='relative rounded-md border p-4 shadow-sm'
              >
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-2 top-2'
                  onClick={() => removeVariant(index)}
                >
                  <IconTrash size={16} />
                </Button>

                <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div>
                    <FormLabel>Variant Name</FormLabel>
                    <Input
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(index, 'name', e.target.value)
                      }
                      placeholder='e.g. Small, Red, etc.'
                    />
                  </div>
                  <div>
                    <FormLabel>SKU</FormLabel>
                    <Input
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(index, 'sku', e.target.value)
                      }
                      placeholder='Stock keeping unit'
                    />
                  </div>
                </div>

                <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3'>
                  <div>
                    <FormLabel>Price</FormLabel>
                    <Input
                      type='number'
                      min='0'
                      step='0.01'
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(index, 'price', e.target.value)
                      }
                      placeholder='0.00'
                    />
                  </div>
                  <div>
                    <FormLabel>Compare Price</FormLabel>
                    <Input
                      type='number'
                      min='0'
                      step='0.01'
                      value={variant.comparePrice}
                      onChange={(e) =>
                        updateVariant(index, 'comparePrice', e.target.value)
                      }
                      placeholder='0.00'
                    />
                  </div>
                  <div>
                    <FormLabel>Stock Quantity</FormLabel>
                    <Input
                      type='number'
                      min='0'
                      value={variant.stockQuantity}
                      onChange={(e) =>
                        updateVariant(index, 'stockQuantity', e.target.value)
                      }
                      placeholder='0'
                    />
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id={`default-${index}`}
                      checked={variant.isDefault}
                      onCheckedChange={() => setDefaultVariant(index)}
                      disabled={variant.isDefault}
                    />
                    <label
                      htmlFor={`default-${index}`}
                      className='text-sm font-medium'
                    >
                      Default Variant
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
