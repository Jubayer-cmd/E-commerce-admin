import { Outlet } from 'react-router-dom'
import { AuthProvider } from '@/lib/AuthProvider'

export default function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
