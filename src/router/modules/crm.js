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
            component: () => import('@/views/crm/Segment'),
            name: 'ProgramSegments',
            meta: { auth: true, title: 'Сегменты', icon: 'dashboard' },
        },
        {
            path: '/program/sellings',
            component: () => import('@/views/selling/index'),
            name: 'ProgramSellings',
            meta: { auth: true, title: 'Продажи', icon: 'dashboard' },
        },
    ],
}
