import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from './useAxiosSecure'
import useAxiosPublic from './useAxiosPublic.jsx'
import { useAuth } from '@/lib/utils'

const useFetchData = (qKey, url, dependencies = {}, secure = false) => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const axiosPublic = useAxiosPublic()
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [qKey, dependencies],
    enabled: secure ? !!user : true,
    queryFn: async () => {
      try {
        let res
        if (secure) {
          res = await axiosSecure.get(url)
        } else res = await axiosPublic.get(url)
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
  })
  return { data, isLoading, refetch, error }
}

export default useFetchData
