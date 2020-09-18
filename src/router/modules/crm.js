export default {
    children: [
        {
            path: '/program/accounts',
            component: () => import('@/views/SkeletonPage'),
            name: 'ProgramAccounts',
            meta: { auth: true, title: 'Клиенты', icon: 'dashboard' },
        },
        {
            path: '/program/segments',
            component: () => import('@/views/SkeletonPage'),
            name: 'ProgramSegments',
            meta: { auth: true, title: 'Сегменты', icon: 'dashboard' },
        },
        {
            path: '/program/sellings',
            component: () => import('@/views/SkeletonPage'),
            name: 'ProgramSellings',
            meta: { auth: true, title: 'Клиенты', icon: 'dashboard' },
        },
    ],
}
