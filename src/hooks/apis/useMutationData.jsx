import { useMutation } from '@tanstack/react-query'
import { useAxiosSecure, useAxiosPublic } from './useAxios'

const useMutationData = (
  onSuccess = () => {},
  onError = () => {},
  secure = true
) => {
  const axiosSecure = useAxiosSecure()
  const axiosPublic = useAxiosPublic()
  const axiosInstance = secure ? axiosSecure : axiosPublic

  const { mutate, isPending, isError, error, ...rest } = useMutation({
    mutationFn: async (object) => {
      const { method, url, data = null, headers = {} } = object

      if (method === 'post') {
        return axiosInstance.post(url, data, { headers })
      }
      if (method === 'patch') {
        return axiosInstance.patch(url, data, { headers })
      }
      if (method === 'delete') {
        return axiosInstance.delete(url)
      }

      throw new Error(`Unsupported method: ${method}`)
    },
    onSuccess,
    onError,
  })

  // For backwards compatibility, expose isPending as isLoading
  const isLoading = isPending

  return { mutate, isLoading, isPending, isError, error, ...rest }
}

export default useMutationData
