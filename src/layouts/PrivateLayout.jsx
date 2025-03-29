import { useContext, Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '@/lib/AuthProvider'
import AppShell from '@/components/app-shell'

export default function PrivateLayout() {
  const { user, loading, error } = useContext(AuthContext)

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!user) {
    return <Navigate to='/auth/sign-in' replace />
  }

  return (
    <AppShell>
      <Suspense
        fallback={
          <div className='flex h-screen items-center justify-center'>
            Loading...
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </AppShell>
  )
}
