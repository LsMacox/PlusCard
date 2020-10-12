
import GuardEmptyPrograms from '@/router/guards/guard-empty-programs'

export default {
    children: [
        {
            path: '/communications/chat',
            name: 'Chat',
            beforeEnter: GuardEmptyPrograms,
            redirect: '/communications/chat/business',
            meta: { auth: true, title: 'Чаты', icon: '' },
          },
          {
            path: '/communications/chat/:conversation_type',    
            beforeEnter: GuardEmptyPrograms,        
            component: () => import('@/views/communications/Chat'),
            name: 'ChatType',
            props: route => ({
              conversationType: route.params.conversation_type,
              conversationId: null,
            }),
            meta: { auth: true, title: 'Чаты', icon: '' },
          },
          {
            path: '/communications/chat/:conversation_type/:conversation_id',
            name: 'ChatConversation',
            beforeEnter: GuardEmptyPrograms,
            component: () => import('@/views/communications/Chat'),
            props: route => ({
              conversationType: route.params.conversation_type,
              conversationId: +route.params.conversation_id,
            }),
            meta: { auth: true, title: 'Чаты', icon: '' },
          },
    ],
}
