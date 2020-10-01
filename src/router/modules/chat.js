export default {
    children: [
        {
            path: '/communications/chat',
            name: 'Chat',
            redirect: '/communications/chat/business',
            meta: { auth: true, title: 'Чаты', icon: '' },
          },
          {
            path: '/communications/chat/:conversation_type',
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
            component: () => import('@/views/communications/Chat'),
            props: route => ({
              conversationType: route.params.conversation_type,
              conversationId: +route.params.conversation_id,
            }),
            meta: { auth: true, title: 'Чаты', icon: '' },
          },
    ],
}
