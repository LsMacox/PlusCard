
import GuardEmptyPrograms from '@/router/guards/guard-empty-programs'

export default {
    children: [
        {
            path: '/program/accounts',
            beforeEnter: GuardEmptyPrograms,
            component: () => import('@/views/crm/Client'),
            name: 'ProgramAccounts',
            meta: { auth: true, title: 'Клиенты', icon: 'dashboard' },
        },
        {
            path: '/program/segments',
            beforeEnter: GuardEmptyPrograms,
            component: () => import('@/views/crm/Segment'),
            name: 'ProgramSegments',
            meta: { auth: true, title: 'Сегменты', icon: 'dashboard' },
        },
        {
            path: '/program/sellings',
            beforeEnter: GuardEmptyPrograms,
            component: () => import('@/views/selling/index'),
            name: 'ProgramSellings',
            meta: { auth: true, title: 'Продажи', icon: 'dashboard' },
        },
    ],
}
