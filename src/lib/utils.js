import { clsx } from 'clsx'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { AuthContext } from './AuthProvider'
export const useAuth = () => useContext(AuthContext)
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format a camelCase or snake_case string to a readable display name
 */
export function formatDisplayName(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim()
}
