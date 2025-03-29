import { useState, useEffect } from 'react'
import { DataTable } from '@/pages/tasks/components/data-table'
import { useAxiosSecure } from '@/hooks/apis/useAxios'
import Loading from '../loading'
import { toast } from 'sonner'

export const ReusableDataTable = ({
  endpoint,
  columns,
  dataPath = 'data', // Default path to access data in API response
  refreshTrigger = null, // Optional prop to trigger refresh
  filterParams = {}, // Optional query parameters
  onDataLoaded = null, // Optional callback when data is loaded
}) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const axiosSecure = useAxiosSecure()

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Create URL with query parameters if provided
      let url = endpoint
      if (Object.keys(filterParams).length > 0) {
        const queryParams = new URLSearchParams(filterParams).toString()
        url = `${endpoint}?${queryParams}`
      }

      const response = await axiosSecure.get(url)

      // Access data using the provided path or default
      const fetchedData =
        dataPath.split('.').reduce((obj, key) => obj?.[key], response) || []
      setData(fetchedData)

      // Call the callback if provided
      if (onDataLoaded) {
        onDataLoaded(fetchedData)
      }
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error)
      toast.error(
        `Failed to load data: ${error.response?.data?.message || error.message}`
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on mount and when refreshTrigger changes
  useEffect(() => {
    fetchData()
  }, [endpoint, refreshTrigger, JSON.stringify(filterParams)])

  return (
    <>{isLoading ? <Loading /> : <DataTable data={data} columns={columns} />}</>
  )
}

// Export with a specific name for better imports
export default ReusableDataTable
