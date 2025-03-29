import { clsx } from 'clsx'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { AuthContext } from './AuthProvider'
export const useAuth = () => useContext(AuthContext)
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
