/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootLayout from '@/layouts/RootLayout'
import PrivateLayout from '@/layouts/PrivateLayout'
import Loading from '../components/custom/loading'
import { AuthProvider } from '@/lib/AuthProvider'

const Dashboard = lazy(() => import('@/pages/dashboard'))
const NotFoundError = lazy(() => import('@/pages/errors/not-found-error'))
const Users = lazy(() => import('@/pages/users/users'))
const Tasks = lazy(() => import('@/pages/tasks'))
const ComingSoon = lazy(() => import('@/components/coming-soon'))
const SettingsProfile = lazy(() => import('@/pages/settings/profile'))
const SignIn = lazy(() => import('@/pages/auth/sign-in'))
const SignUp = lazy(() => import('@/pages/auth/sign-up'))
const ForgotPassword = lazy(() => import('@/pages/auth/forgot-password'))
const Otp = lazy(() => import('@/pages/auth/otp'))
const SettingsAccount = lazy(() => import('@/pages/settings/account'))
const SettingsAppearance = lazy(() => import('@/pages/settings/appearance'))
const Blogs = lazy(() => import('@/pages/blogs/blogs'))
const SettingsNotifications = lazy(
  () => import('@/pages/settings/notifications')
)
const Promotion = lazy(() => import('@/pages/promotion/promotion'))
const Brands = lazy(() => import('@/pages/brands/Brands'))
const Banners = lazy(() => import('@/pages/banners/Banners'))
const SubCategory = lazy(
  () => import('@/pages/categories/sub-category/Subcategory')
)
const Category = lazy(() => import('@/pages/categories/category/Category'))
const Product = lazy(() => import('@/pages/product/product'))
const SettingsDisplay = lazy(() => import('@/pages/settings/display'))

const supportTicket = lazy(() => import('@/pages/support-ticket/SupporTicket'))
const withSuspense = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
)

const AuthenticatedRootLayout = () => (
  <AuthProvider>
    <RootLayout />
  </AuthProvider>
)

const routes = createBrowserRouter([
  {
    element: <AuthenticatedRootLayout />,
    errorElement: withSuspense(NotFoundError),
    children: [
      {
        path: 'auth',
        children: [
          { path: 'sign-in', element: withSuspense(SignIn) },
          { path: 'sign-up', element: withSuspense(SignUp) },
          { path: 'forgot-password', element: withSuspense(ForgotPassword) },
          { path: 'otp', element: withSuspense(Otp) },
        ],
      },
      {
        path: '/',
        element: <PrivateLayout />,
        children: [
          { index: true, element: withSuspense(Dashboard) },
          { path: 'tasks', element: withSuspense(Tasks) },
          { path: 'users', element: withSuspense(Users) },
          { path: 'analysis', element: withSuspense(ComingSoon) },
          {
            path: 'category',
            element: withSuspense(Category),
          },
          {
            path: 'subcategories',
            element: withSuspense(SubCategory),
          },
          {
            path: 'products',
            element: withSuspense(Product),
          },
          {
            path: 'promotion',
            element: withSuspense(Promotion),
          },
          {
            path: 'banners',
            element: withSuspense(Banners),
          },
          {
            path: 'brands',
            element: withSuspense(Brands),
          },
          {
            path: 'blogs',
            element: withSuspense(Blogs),
          },
          {
            path: 'support-ticket',
            element: withSuspense(supportTicket),
          },
          {
            path: 'settings',
            element: withSuspense(SettingsProfile),
            children: [
              { index: true, element: withSuspense(SettingsProfile) },
              { path: 'account', element: withSuspense(SettingsAccount) },
              { path: 'appearance', element: withSuspense(SettingsAppearance) },
              {
                path: 'notifications',
                element: withSuspense(SettingsNotifications),
              },
              { path: 'display', element: withSuspense(SettingsDisplay) },
            ],
          },
        ],
      },
    ],
  },
])

export default routes
