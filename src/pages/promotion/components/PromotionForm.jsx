import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { IconLoader2 } from '@tabler/icons-react'
import useMutationData from '@/hooks/apis/useMutationData'
import useFetchData from '@/hooks/apis/useFetchData'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  promotionFormSchema,
  defaultValues,
} from './schema/promotionFormSchema'
import { Form } from '@/components/ui/form'

// Import sections
import GeneralSection from './sections/GeneralSection'
import DiscountSection from './sections/DiscountSection'
import ConditionsSection from './sections/ConditionsSection'
import TargetingSection from './sections/TargetingSection'

export default function PromotionForm({ onCancel, refetch, promotion }) {
  const [previewUrl, setPreviewUrl] = useState('')

  // Fetch products and categories for multi-select fields
  const { data: productsResponse = { data: [] } } = useFetchData(
    'products',
    '/products/',
    {},
    true
  )
  const { data: categoriesResponse = { data: [] } } = useFetchData(
    'categories',
    '/categories/',
    {},
    true
  )

  // Extract data from the response and format for MultiSelect
  // Handle the exact structure shown in the API response
  const products = React.useMemo(() => {
    const productsList = Array.isArray(productsResponse?.data)
      ? productsResponse.data
      : Array.isArray(productsResponse)
        ? productsResponse
        : []

    // Format products for MultiSelect component
    return productsList.map((product) => ({
      value: product.id,
      label: product.name,
    }))
  }, [productsResponse])

  const categories = React.useMemo(() => {
    const categoriesList = Array.isArray(categoriesResponse?.data)
      ? categoriesResponse.data
      : Array.isArray(categoriesResponse)
        ? categoriesResponse
        : []

    // Format categories for MultiSelect component
    return categoriesList.map((category) => ({
      value: category.id,
      label: category.name,
    }))
  }, [categoriesResponse])

  // Initialize form with schema validation
  const form = useForm({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: defaultValues,
  })

  // Populate form if editing
  useEffect(() => {
    if (promotion) {
      const {
        name,
        code,
        description,
        image,
        type,
        discount,
        discountType,
        maxDiscount,
        minPurchase,
        startDate,
        endDate,
        usageLimit,
        usageLimitPerUser,
        isActive,
        conditions,
      } = promotion

      const productIds =
        promotion.appliedProducts?.map((item) => item.productId) ||
        promotion.productIds ||
        []

      const categoryIds =
        promotion.appliedCategories?.map((item) => item.categoryId) ||
        promotion.categoryIds ||
        []

      // Process conditions to handle jsonValue if present
      const processedConditions =
        conditions?.map((condition) => {
          // Keep the original condition structure but ensure we handle jsonValue
          return {
            conditionType: condition.conditionType,
            value: condition.value,
            jsonValue: condition.jsonValue || undefined,
          }
        }) || []

      // Set form values
      form.reset({
        name,
        code,
        description: description || '',
        type,
        discount: parseFloat(discount) || 0,
        discountType,
        maxDiscount: maxDiscount !== null ? parseFloat(maxDiscount) : null,
        minPurchase: minPurchase !== null ? parseFloat(minPurchase) : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: usageLimit !== null ? parseInt(usageLimit) : null,
        usageLimitPerUser:
          usageLimitPerUser !== null ? parseInt(usageLimitPerUser) : null,
        isActive,
        productIds,
        categoryIds,
        conditions: processedConditions,
      })

      // Set image preview
      if (image) {
        setPreviewUrl(image)
      }
    }
  }, [promotion, form])

  const { mutate, isLoading } = useMutationData(
    () => {
      toast.success('Success', {
        description: `Promotion ${promotion ? 'updated' : 'created'} successfully!`,
      })
      refetch?.()
      onCancel()
    },
    (error) => {
      toast.error('Error', {
        description:
          error?.response?.data?.message ||
          `Failed to ${promotion ? 'update' : 'create'} promotion!`,
      })
    }
  )

  // Helper functions for conditions
  const addCondition = () => {
    const currentConditions = form.getValues('conditions') || []
    form.setValue('conditions', [
      ...currentConditions,
      { conditionType: '', value: '', jsonValue: undefined },
    ])
  }

  const removeCondition = (index) => {
    const currentConditions = form.getValues('conditions') || []
    form.setValue(
      'conditions',
      currentConditions.filter((_, i) => i !== index)
    )
  }

  const onSubmit = (values) => {
    // Extract and process values to match the backend API structure
    const {
      name,
      code,
      description,
      type,
      discount,
      discountType,
      maxDiscount,
      minPurchase,
      startDate,
      endDate,
      usageLimit,
      usageLimitPerUser,
      isActive,
      productIds,
      categoryIds,
      conditions,
      image,
    } = values

    // Format API payload
    const apiPayload = {
      name,
      code,
      description: description || '',
      type,
      discount: discount.toString(), // API expects string
      discountType,
      maxDiscount: maxDiscount !== null ? maxDiscount.toString() : null, // API expects string or null
      minPurchase: minPurchase !== null ? minPurchase.toString() : null, // API expects string or null
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      usageLimit: usageLimit !== null ? usageLimit.toString() : null, // API expects string or null
      usageLimitPerUser:
        usageLimitPerUser !== null ? usageLimitPerUser.toString() : null, // API expects string or null
      isActive,
      productIds: productIds || [], // Ensure arrays are always provided
      categoryIds: categoryIds || [],
      conditions:
        conditions?.map((condition) => ({
          conditionType: condition.conditionType,
          value: condition.value,
          jsonValue: condition.jsonValue || null,
        })) || [],
    }

    // Create FormData for image upload and other fields
    const formData = new FormData()

    // Add image if available
    if (image instanceof File) {
      formData.append('file', image)
    } else if (promotion?.image) {
      formData.append('image', promotion.image) // Keep existing image
    }

    // Append all other fields as JSON
    Object.entries(apiPayload).forEach(([key, value]) => {
      if (key !== 'image') {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined && value !== null) {
          formData.append(key, value)
        } else if (value === null) {
          formData.append(key, 'null')
        }
      }
    })

    const url = promotion
      ? `/promotion/${promotion.id}`
      : '/promotion/create-promotion'
    const method = promotion ? 'patch' : 'post'

    mutate({
      method,
      url,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <GeneralSection
          form={form}
          previewUrl={previewUrl}
          isEditing={!!promotion}
        />

        {['discount', 'flash_sale', 'seasonal_offer', 'bundle_deal'].includes(
          form.watch('type')
        ) && <DiscountSection form={form} />}

        <ConditionsSection
          form={form}
          addCondition={addCondition}
          removeCondition={removeCondition}
        />

        <TargetingSection
          form={form}
          products={products}
          categories={categories}
        />

        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center'>
                <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                {promotion ? 'Updating...' : 'Saving...'}
              </div>
            ) : promotion ? (
              'Update Promotion'
            ) : (
              'Save Promotion'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
