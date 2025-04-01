import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export default function DiscountSection({ form }) {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>Discount Settings</h3>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <FormField
          control={form.control}
          name='discount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='10'
                  min='0'
                  step='0.01'
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                Enter a numeric value (e.g., 10 for 10% or $10)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='discountType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select discount type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='percentage'>Percentage (%)</SelectItem>
                  <SelectItem value='fixed_amount'>Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {form.watch('discountType') === 'percentage' && (
        <FormField
          control={form.control}
          name='maxDiscount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Discount ($)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='100'
                  min='0'
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? null : parseFloat(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                Maximum discount amount when using percentage
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
