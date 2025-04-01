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
import { Switch } from '@/components/ui/switch'
import { MultiSelect } from '@/components/ui/multi-select'
import { useEffect } from 'react'

export default function ConditionsSection({
  form,
  addCondition,
  removeCondition,
}) {
  const conditions = form.watch('conditions') || []

  // Get payment methods and user groups from a data source
  const paymentMethods = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cash_on_delivery', label: 'Cash on Delivery' },
  ]

  const userGroups = [
    { value: 'new_customer', label: 'New Customers' },
    { value: 'returning_customer', label: 'Returning Customers' },
    { value: 'vip', label: 'VIP Members' },
    { value: 'wholesale', label: 'Wholesale Buyers' },
  ]

  // Update the value field when condition type changes
  useEffect(() => {
    conditions.forEach((condition, index) => {
      const currentType = form.watch(`conditions.${index}.conditionType`)
      const currentValue = form.watch(`conditions.${index}.value`)

      // Reset value when type changes
      if (currentType && currentValue === '') {
        if (['first_time_purchase', 'free_shipping'].includes(currentType)) {
          form.setValue(`conditions.${index}.value`, 'true')
        }
      }
    })
  }, [conditions, form])

  // Render appropriate input based on condition type
  const renderValueInput = (index, type) => {
    switch (type) {
      case 'min_purchase_amount':
      case 'min_quantity':
        return (
          <Input
            type='number'
            min='0'
            step={type === 'min_purchase_amount' ? '0.01' : '1'}
            placeholder={type === 'min_purchase_amount' ? '100.00' : '5'}
            {...form.register(`conditions.${index}.value`)}
          />
        )

      case 'first_time_purchase':
      case 'free_shipping':
        return (
          <Switch
            checked={form.watch(`conditions.${index}.value`) === 'true'}
            onCheckedChange={(checked) =>
              form.setValue(
                `conditions.${index}.value`,
                checked ? 'true' : 'false'
              )
            }
          />
        )

      case 'payment_method':
        return (
          <Select
            onValueChange={(value) =>
              form.setValue(`conditions.${index}.value`, value)
            }
            defaultValue={form.watch(`conditions.${index}.value`)}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select payment method' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'user_group':
        return (
          <Select
            onValueChange={(value) =>
              form.setValue(`conditions.${index}.value`, value)
            }
            defaultValue={form.watch(`conditions.${index}.value`)}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select user group' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {userGroups.map((group) => (
                <SelectItem key={group.value} value={group.value}>
                  {group.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            placeholder='Condition value'
            {...form.register(`conditions.${index}.value`)}
          />
        )
    }
  }

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
                          <SelectItem value='first_time_purchase'>
                            First Time Purchase
                          </SelectItem>
                          <SelectItem value='specific_products'>
                            Specific Products
                          </SelectItem>
                          <SelectItem value='specific_categories'>
                            Specific Categories
                          </SelectItem>
                          <SelectItem value='min_quantity'>
                            Minimum Quantity
                          </SelectItem>
                          <SelectItem value='total_items'>
                            Total Items
                          </SelectItem>
                          <SelectItem value='user_role'>User Role</SelectItem>
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
                        {renderValueInput(
                          index,
                          form.watch(`conditions.${index}.conditionType`)
                        )}
                      </FormControl>
                      <FormDescription>
                        {form.watch(`conditions.${index}.conditionType`) ===
                          'min_purchase_amount' &&
                          'Minimum purchase amount in dollars'}
                        {form.watch(`conditions.${index}.conditionType`) ===
                          'min_quantity' && 'Minimum quantity of products'}
                      </FormDescription>
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
