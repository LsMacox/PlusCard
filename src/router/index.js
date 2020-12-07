import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import AuthLayout from '@/layouts/auth'
import CabinetLayout from '@/layouts/cabinet'
import CrmRouters from './modules/crm'
import ChatRouters from './modules/chat'

import GuardEmptyPrograms from '@/router/guards/guard-empty-programs'
import GuardLoadingApp from '@/router/guards/guard-loading-app'

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
    {
      path: '/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'Login',
          redirect: 'email',
        },
        {
          path: 'email',
          component: () => import('@/views/auth/login/email/index'),
        },
        {
          path: 'phone',
          component: () => import('@/views/auth/login/phone/index'),
        },
        {
          path: 'phone/confirm',
          props: (route) => ({ phone: route.query.phone }),
          component: () => import('@/views/auth/login/phone/confirm'),
        },
      ],
    },
    {
      path: '/registration',
      component: AuthLayout,
      children: [
        {
          path: '',
          component: () => import('@/views/auth/registration/index'),
        },
        {
          path: 'send',
          component: () => import('@/views/auth/registration/send'),
        },
        {
          path: 'confirm',
          component: () => import('@/views/auth/registration/confirm'),
        },
        {
          path: 'expired',
          component: () => import('@/views/auth/registration/expired'),
        },
      ],
    },
    {
      path: '/password',
      component: AuthLayout,
      children: [
        {
          path: '',
          redirect: 'forget',
        },
        {
          path: 'forget',
          component: () => import('@/views/auth/password/forget/index'),
        },
        {
          path: 'change',
          component: () => import('@/views/auth/password/change/index'),
        },
        {
          path: 'expired',
          component: () => import('@/views/auth/password/expired/index'),
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
      beforeEnter: GuardLoadingApp,
      component: CabinetLayout,
      meta: { auth: true },
      children: [
        {
          path: '',
          redirect: 'dashboard',
        },
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard/index'),
          name: 'Dashboard',
          meta: { auth: true, title: 'Dashboard', icon: 'dashboard' },
        },
        {
          path: 'company/:program_id',
          component: () => import('@/views/dashboard/form_update/index'),
          name: 'Company',
          redirect: '/info',
          meta: { auth: true },
          children: [
            // {
            //   path: '',
            //   redirect: 'info',
            // },
            {
              path: 'info',
              component: () => import('@/views/dashboard/form_update/UpdateInfo'),
              name: 'CompanyUpdateInfo',
              meta: { auth: true },
            },
            {
              path: 'shop',
              component: () => import('@/views/dashboard/form_update/UpdateShop'),
              name: 'CompanyUpdateShop',
              meta: { auth: true },
            },
            {
              path: 'contact',
              component: () => import('@/views/dashboard/form_update/UpdateContact'),
              name: 'CompanyUpdateContact',
              meta: { auth: true },
            },
          ],
        },
        {
          path: '/program/bonus/settings',
          component: () => import('@/views/BonusSettings'),
          beforeEnter: GuardEmptyPrograms,
          name: 'ProgramBonusSetting',
          meta: { auth: true, title: 'ProgramBonusSetting', icon: 'ui_kit' },
        },
        {
          path: '/master/old',
          component: () => import('@/views/master/Master'),
          name: 'MasterOld',
          meta: { auth: true, title: 'Master', icon: 'master' },
        },
        {
          path: '/master',
          component: () => import('@/views/company/master'),
          name: 'Master',
          meta: { auth: true, title: 'Master', icon: 'master' },
        },
        // {
        //   path: '/loyalty',
        //   component: () => import('@/views/loyalty/index'),
        //   name: 'loyalty',
        //   meta: { auth: true },
        // },
        {
          path: '/loyalty',
          beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/loyalty/index'),
          name: 'loyalty',
          meta: { auth: true },
        },
        {
          path: '/loyalty/setting',
          component: () => import('@/views/BonusSettings/index'),
          name: 'LoyaltySetting',
          meta: { auth: true },
        },
        {
          path: '/ui_kit',
          component: () => import('@/views/ui_kit/Components.vue'),
          name: 'components',
          meta: { title: 'ui_kit', icon: 'ui_kit' },
        },
        {
          path: '/icons',
          component: () => import('@/views/ui_kit/IconifyIcons.vue'),
          name: 'icons',
          meta: { title: 'ui_kit', icon: 'ui_kit' },
        },
        {
          path: '/program/certificate/list',
          beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/certificate/ProgramCertificateView.vue'),
          name: 'ProgramCertificateList',
          meta: { auth: true, title: 'ui_kit', icon: 'ui_kit' },
        },
        // {
        //   path: '/program/certificate/:cert_id',
        //   redirect: '/program/certificate/:cert_id/main',
        //   name: 'ProgramCertificateForm',
        // },
        {
          path: '/program/certificate/:cert_id',
          component: () => import('@/views/certificate/EditForm/index.vue'),
          props: (route) => ({ certId: +route.params.cert_id, startPage: route.hash || '#main' }),
          name: 'ProgramCertificateForm',
          meta: { auth: true, title: 'ui_kit', icon: 'ui_kit' },
        },
        {
          path: '/certificate/master',
          component: () => import('@/views/certificate/master/index.vue'),
          name: 'ProgramCertificateMaster',
          meta: { auth: true, title: 'ui_kit', icon: 'ui_kit' },
        },
        {
          path: '/account/certificates',
          beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/account/certificate/table/index'),
          name: 'UserCertificates',
          meta: { auth: true, title: 'Certificates', icon: 'certificates' },
        },
        {
          path: 'actions',
          beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/SkeletonPage'),
          name: 'Actions',
          meta: { auth: false, title: 'Help', icon: 'dashboard' },
        },
        {
          path: '/program/broadcasters',
          beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/company/EventBroadcasters'),
          name: 'EventBroadcastersList',
          meta: { auth: true, title: 'EventBroadcastersList', icon: 'dashboard' },
        },
        {
          path: '/program/broadcaster/:id',
          component: () => import('@/views/company/EventBroadcasters/EventBroadcasterFormTabs/index.vue'),
          props: (route) => ({ broadcasterId: +route.params.id, startPage: route.hash || '#main' }),
          name: 'EventBroadcasterForm',
          meta: { auth: true, title: 'EventBroadcasterForm', icon: 'dashboard' },
        },
        {
          path: '/program/broadcasters/master',
          beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/company/EventBroadcasters/master'),
          name: 'EventBroadcasterMaster',
          meta: { auth: true, title: 'EventBroadcastersMaster', icon: 'dashboard' },
        },
        {
          path: 'sendings',
          beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/sendings/index'),
          name: 'Sendings',
          meta: { auth: false, title: 'Help', icon: 'dashboard' },
        },
        {
          path: 'sendings/templates',
          beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/sendings/templates/index'),
          name: 'SendingsTemplates',
          meta: { auth: false, title: 'Help', icon: 'dashboard' },
        },
        {
          path: 'sendings/templates/:id',
          beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/sendings/templates/form/index'),
          name: 'SendingsTemplatesForm',
          meta: { auth: false, title: 'Help', icon: 'dashboard' },
        },
        {
          path: 'moderations',
          beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/moderations/index'),
          name: 'Moderations',
          meta: { auth: true, title: 'Moderations', icon: 'dashboard' },
        },
        {
          path: 'settings',
          // beforeEnter: GuardEmptyPrograms,
          component: () => import('@/views/settings/index'),
          name: 'Settings',
          redirect: 'settings/menu',
          meta: { auth: true, title: 'Settings', icon: 'dashboard' },
          children: [
            {
              path: 'menu',
              component: () => import('@/views/settings/ProgramSettings.vue'),
              name: 'SettingsMenu',
              meta: { auth: true },
            },
            {
              path: 'requisites',
              component: () => import('@/views/settings/requisites/index'),
              props: (route) => ({ startTab: route.hash || '#org' }),
              name: 'SettingsRequisites',
              meta: { auth: true },
            },
            {
              path: 'staff',
              component: () => import('@/views/settings/staff/index'),
              name: 'SettingsStaff',
              meta: { auth: true },
            },
            {
              path: 'integration',
              beforeEnter: GuardEmptyPrograms,
              component: () => import('@/views/settings/integration/index'),
              name: 'SettingsIntegration',
              meta: { auth: true },
            },
            {
              path: 'sendings',
              beforeEnter: GuardEmptyPrograms,
              component: () => import('@/views/settings/sendings/index.vue'),
              name: 'SettingsSendings',
              meta: { auth: true },
            },
            {
              path: 'chat',
              component: () => import('@/views/settings/chat/index'),
              name: 'SettingsChat',
              meta: { auth: true },
            },
          ],
        },
        {
          path: 'help',
          component: () => import('@/views/HelpPage'),
          name: 'Help',
          meta: { auth: false, title: 'Help', icon: 'dashboard' },
        },
        {
          path: 'todo',
          component: () => import('@/views/SkeletonPage'),
          name: 'Todo',
          meta: { auth: false, title: 'Todo', icon: 'dashboard' },
        },

      ]
      .concat(
        CrmRouters.children,
        ChatRouters.children,
        )
      .concat([
          // 404 page
        {
          path: '*',
          component: () => import('@/components/error-page/404'),
          name: '404',
          meta: { auth: false },
        },
      ]),
    },

  ],
})

export function resetRouter () {}
