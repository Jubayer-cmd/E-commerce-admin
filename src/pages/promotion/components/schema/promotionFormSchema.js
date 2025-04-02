import * as z from 'zod'

// Define promotion type and discount type values based on Prisma schema
const PromotionType = {
  discount: 'discount',
  flash_sale: 'flash_sale',
  seasonal_offer: 'seasonal_offer',
  bundle_deal: 'bundle_deal',
  bogo: 'bogo',
  free_shipping: 'free_shipping',
}

const DiscountType = {
  percentage: 'percentage',
  fixed_amount: 'fixed_amount',
}

// Update condition types to match Prisma schema
const ConditionType = {
  first_time_purchase: 'first_time_purchase',
  specific_products: 'specific_products',
  specific_categories: 'specific_categories',
  quantity_threshold: 'quantity_threshold',
  minimum_purchase_amount: 'minimum_purchase_amount',
  total_items: 'total_items',
  user_role: 'user_role',
  time_of_day: 'time_of_day',
  day_of_week: 'day_of_week',
}

// Validation schema for the condition object
const conditionSchema = z.object({
  conditionType: z.string().min(1, { message: 'Condition type is required' }),
  value: z.string().min(1, { message: 'Condition value is required' }),
  jsonValue: z.any().nullable().optional(), // Support for JSON value
  isActive: z.boolean().optional().default(true), // Added to match schema
})

// Main promotion form schema
export const promotionFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' })
      .max(100, { message: 'Name cannot exceed 100 characters' }),
    code: z
      .string()
      .min(3, { message: 'Code must be at least 3 characters long' })
      .max(20, { message: 'Code cannot exceed 20 characters' })
      .refine((val) => /^[A-Za-z0-9_-]+$/.test(val), {
        message:
          'Code can only contain letters, numbers, underscores, and hyphens',
      }),
    description: z.string().optional(),
    type: z.string({
      required_error: 'Please select a promotion type',
    }),
    discount: z
      .number({
        required_error: 'Discount is required',
        invalid_type_error: 'Discount must be a number',
      })
      .min(0, { message: 'Discount must be a positive number' }),
    discountType: z.string({
      required_error: 'Please select a discount type',
    }),
    maxDiscount: z
      .number({
        invalid_type_error: 'Maximum discount must be a number',
      })
      .nullable()
      .optional(),
    minPurchase: z
      .number({
        invalid_type_error: 'Minimum purchase must be a number',
      })
      .nullable()
      .optional(),
    startDate: z.date({
      required_error: 'Start date is required',
    }),
    endDate: z.date({
      required_error: 'End date is required',
    }),
    usageLimit: z
      .number({
        invalid_type_error: 'Usage limit must be a number',
      })
      .int()
      .positive()
      .nullable()
      .optional(),
    usageLimitPerUser: z
      .number({
        invalid_type_error: 'Usage limit per user must be a number',
      })
      .int()
      .positive()
      .nullable()
      .optional(),
    isActive: z.boolean().default(true),
    image: z.any().optional(), // For file uploads
    productIds: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
    conditions: z.array(conditionSchema).optional(),
  })
  // Use superRefine to compare startDate and endDate safely
  .superRefine(({ startDate, endDate }, ctx) => {
    if (startDate && endDate && endDate <= startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start date',
        path: ['endDate'],
      })
    }
  })

// Export the condition types for use in the form
export { PromotionType, DiscountType, ConditionType }

// Default values for the form
export const defaultValues = {
  name: '',
  code: '',
  description: '',
  image: null,
  type: PromotionType.discount,
  discount: 0,
  discountType: DiscountType.percentage,
  maxDiscount: null,
  minPurchase: null,
  usageLimit: null,
  usageLimitPerUser: null,
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
  isActive: true,
  productIds: [],
  categoryIds: [],
  conditions: [],
}
