/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: '/ui_kit',
  name: 'ComponentDemo',
  meta: {
    title: 'Components',
    icon: 'component',
  },
  children: [
    {
      path: '/ui_kit',
      component: () => import('@/views/ui_kit/Components.vue'),
      name: 'Dashboard',
      meta: { title: 'ui_kit', icon: 'ui_kit' },
    },
  ],
}

export default componentsRouter
