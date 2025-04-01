import {
  IconBarrierBlock,
  IconChartHistogram,
  IconError404,
  IconExclamationCircle,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  // IconHexagonNumber5,
  IconLayoutDashboard,
  IconServerOff,
  IconSettings,
  IconUserShield,
  IconUsers,
  IconLock,
  IconChecklist,
} from '@tabler/icons-react'

export const sidelinks = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Tasks',
    label: '3',
    href: '/tasks',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Blogs',
    label: '3',
    href: '/blogs',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Banners',
    label: '',
    href: '/banners',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Product',
    label: '',
    href: '',
    icon: <IconUserShield size={18} />,
    sub: [
      {
        title: 'Brands',
        label: '3',
        href: '/brands',
        icon: <IconHexagonNumber1 size={18} />,
      },
      {
        title: 'Category',
        label: '',
        href: '/category',
        icon: <IconHexagonNumber2 size={18} />,
      },
      {
        title: 'Sub-Category',
        label: '',
        href: '/subcategories',
        icon: <IconHexagonNumber3 size={18} />,
      },
    ],
  },
  {
    title: 'Promotion',
    label: '',
    href: '/promotion',
    icon: <IconHexagonNumber4 size={18} />,
  },
  {
    title: 'Users',
    label: '',
    href: '/users',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'Support Ticket',
    label: '',
    href: '/support-ticket',
    icon: <IconHexagonNumber4 size={18} />,
  },
  {
    title: 'Analysis',
    label: '',
    href: '/analysis',
    icon: <IconChartHistogram size={18} />,
  },
  {
    title: 'Error Pages',
    label: '',
    href: '',
    icon: <IconExclamationCircle size={18} />,
    sub: [
      {
        title: 'Not Found',
        label: '',
        href: '/404',
        icon: <IconError404 size={18} />,
      },
      {
        title: 'Internal Server Error',
        label: '',
        href: '/500',
        icon: <IconServerOff size={18} />,
      },
      {
        title: 'Maintenance Error',
        label: '',
        href: '/503',
        icon: <IconBarrierBlock size={18} />,
      },
      {
        title: 'Unauthorised Error',
        label: '',
        href: '/401',
        icon: <IconLock size={18} />,
      },
    ],
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
