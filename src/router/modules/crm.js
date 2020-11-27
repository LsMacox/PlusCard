
import GuardEmptyPrograms from '@/router/guards/guard-empty-programs'

export default {
    children: [
        {
            path: '/program/accounts',
            component: () => import('@/views/crm/client/Client'),
            beforeEnter: GuardEmptyPrograms,
            name: 'ProgramAccounts',
            meta: { auth: true, title: 'Клиенты', icon: 'dashboard' },
        },
        {
            path: '/program/accounts/import',
            component: () => import('@/views/crm/client/import/index'),
            beforeEnter: GuardEmptyPrograms,
            meta: { auth: true, title: 'Импорт клиентов', icon: 'dashboard' },
        },
        {
            path: '/program/segments',
            component: () => import('@/views/crm/segment/Segment'),
            beforeEnter: GuardEmptyPrograms,
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
