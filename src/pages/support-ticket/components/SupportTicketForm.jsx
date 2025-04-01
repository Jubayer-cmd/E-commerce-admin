import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

// Define form schema
const formSchema = z.object({
  status: z.enum(['open', 'pending', 'closed'], {
    required_error: 'Please select a ticket status',
  }),
})

export default function SupportTicketForm({ ticket, onCancel, refetch }) {
  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: ticket?.status || 'open',
    },
  })

  // Update form values when ticket prop changes
  useEffect(() => {
    if (ticket) {
      form.reset({
        status: ticket.status || 'open',
      })
    }
  }, [ticket, form])

  const { mutate, isLoading } = useMutationData(
    () => {
      toast.success('Success', {
        description: 'Ticket status updated successfully!',
      })

      refetch?.()
      onCancel()
    },
    (error) => {
      toast.error('Error', {
        description:
          error?.response?.data?.message || 'Failed to update ticket status!',
      })
    }
  )

  const onSubmit = (values) => {
    if (ticket && ticket.id) {
      // Update existing ticket
      mutate({
        method: 'patch',
        url: `/support/${ticket.id}`,
        data: values,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='mb-4'>
          <h3 className='text-lg font-medium'>Ticket: {ticket?.title}</h3>
          <p className='line-clamp-2 text-sm text-gray-500'>
            {ticket?.description}
          </p>
        </div>

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='open'>Open</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='closed'>Closed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center'>
                <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                Updating...
              </div>
            ) : (
              'Update Status'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
