import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import {
  FormControl,
  FormDescription,
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

export default function ConditionsSection({
  form,
  addCondition,
  removeCondition,
}) {
  const conditions = form.watch('conditions') || []

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Promotion Conditions</h3>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={addCondition}
          className='flex items-center gap-1'
        >
          <IconPlus className='h-4 w-4' />
          Add Condition
        </Button>
      </div>

      <FormDescription>
        Set additional conditions that must be met for this promotion to apply
      </FormDescription>

      {conditions.length === 0 ? (
        <div className='rounded-md border border-dashed p-6 text-center'>
          <p className='text-sm text-muted-foreground'>
            No conditions set. This promotion will apply to all eligible items
            without additional restrictions.
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {conditions.map((_, index) => (
            <div
              key={index}
              className='flex items-start gap-3 rounded-md border p-3'
            >
              <div className='grid flex-1 grid-cols-1 gap-3 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name={`conditions.${index}.conditionType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>Condition Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='min_purchase'>
                            Minimum Purchase
                          </SelectItem>
                          <SelectItem value='first_time_purchase'>
                            First Time Purchase
                          </SelectItem>
                          <SelectItem value='min_quantity'>
                            Minimum Quantity
                          </SelectItem>
                          <SelectItem value='user_group'>User Group</SelectItem>
                          <SelectItem value='payment_method'>
                            Payment Method
                          </SelectItem>
                          <SelectItem value='specific_categories'>
                            Specific Categories
                          </SelectItem>
                          <SelectItem value='minimum_purchase_amount'>
                            Minimum Purchase Amount
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`conditions.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>Value</FormLabel>
                      <FormControl>
                        <Input placeholder='Condition value' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='mt-6 text-destructive hover:bg-destructive/10 hover:text-destructive'
                onClick={() => removeCondition(index)}
              >
                <IconTrash className='h-4 w-4' />
                <span className='sr-only'>Remove condition</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      <FormField
        control={form.control}
        name='minPurchase'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Purchase Amount ($)</FormLabel>
            <FormControl>
              <Input
                type='number'
                placeholder='50'
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
              Minimum order amount required to apply this promotion
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
