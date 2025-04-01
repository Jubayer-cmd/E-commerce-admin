import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { MultiSelect } from '@/components/ui/multi-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TargetingSection({ form, products, categories }) {
  // Ensure products and categories are valid arrays
  const productOptions = Array.isArray(products) ? products : []
  const categoryOptions = Array.isArray(categories) ? categories : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Targeting</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <FormField
          control={form.control}
          name='productIds'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apply to Products</FormLabel>
              <FormControl>
                <MultiSelect
                  options={productOptions}
                  placeholder='Select products'
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='categoryIds'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apply to Categories</FormLabel>
              <FormControl>
                <MultiSelect
                  options={categoryOptions}
                  placeholder='Select categories'
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
