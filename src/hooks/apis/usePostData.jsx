import { useMutation } from '@tanstack/react-query'
import { useAxiosSecure, useAxiosPublic } from './useAxios'

const usePostData = (onSuccess = () => {}, secure = true) => {
  const axiosSecure = useAxiosSecure()
  const axiosPublic = useAxiosPublic()
  const axiosInstance = secure ? axiosSecure : axiosPublic

  return useMutation({
    mutationFn: (object) => {
      const { method, url, data = null } = object
      if (method === 'post') return axiosInstance.post(url, data)
      if (method === 'patch') return axiosInstance.patch(url, data)
      if (method === 'delete') return axiosInstance.delete(url)
    },
    onSuccess,
  })
}

export default usePostData
