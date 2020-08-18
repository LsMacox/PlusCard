import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'

/* Router Modules */

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: "/redirect",
    //   component: Layout,
    //   hidden: true,
    //   children: [
    //     {
    //       path: "/redirect/:path(.*)",
    //       component: () => import("@/views/redirect/index")
    //     }
    //   ]
    // },
    {
      path: '/login',
      component: () => import('@/views/login/index'),
      children: [
        {
          path: '',
          redirect: 'email',
        },
        {
          path: 'email',
          component: () => import('@/views/login/index'),
        },
      ],
    },

    // {
    //   path: "/auth-redirect",
    //   component: () => import("@/views/login/auth-redirect"),
    //   hidden: true
    // },
    {
      path: '/404',
      component: () => import('@/views/error-page/404'),
      hidden: true,
    },
    {
      path: '/401',
      component: () => import('@/views/error-page/401'),
      hidden: true,
    },
    {
      path: '/',
      component: Layout,
      redirect: '/components',
      meta: { auth: true },
      children: [
        {
          path: '/dashboard',
          component: () => import('@/views/dashboard/Dashboard'),
          name: 'Dashboard',
          meta: { auth: true, title: 'Dashboard', icon: 'dashboard' },
        },
        {
          path: '/master',
          component: () => import('@/views/master/Master'),
          name: 'Master',
          meta: { auth: true, title: 'Master', icon: 'master' },
        },
        {
          path: '/ui_kit',
          component: () => import('@/views/ui_kit/Components.vue'),
          name: 'components',
          meta: { title: 'ui_kit', icon: 'ui_kit' },
        },
      ],
    },
  ],
})

export function resetRouter () {}
