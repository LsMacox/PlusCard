import Vue from 'vue'
import IconifyIcon from '@iconify/vue'

// https://iconify.design/icon-sets/?query=plus-circle
// npm i @iconify/icons-bx -D
// npm i @iconify/icons-codicon -D
export const ICONIFY_ICONS = [
  //uil
  { id: 'plus-circle', component: () => import('@iconify/icons-uil/plus-circle') },

  // ant-design
  { id: 'plus-circle-outlined', component: () => import('@iconify/icons-ant-design/plus-circle-outlined') },
  { id: 'search-outlined', component: () => import('@iconify/icons-ant-design/search-outlined') },
  { id: 'ant-design-gift-outlined', component: () => import('@iconify/icons-ant-design/gift-outlined') },
 
  // bx
  { id: 'bx-check', component: () => import('@iconify/icons-bx/bx-check') },
  { id: 'arrow-back', component: () => import('@iconify/icons-bx/bx-arrow-back') },

  // codicon
  { id: 'chrome-close', component: () => import('@iconify/icons-codicon/chrome-close') },

  // jam
  { id: 'jam-close', component: () => import('@iconify/icons-jam/close') },

  // ion
  { id: 'ion-close', component: () => import('@iconify/icons-ion/close') },
  { id: 'ion-stats-chart', component: () => import('@iconify/icons-ion/stats-chart') }, 
  { id: 'ion-wallet-outline', component: () => import('@iconify/icons-ion/wallet-outline') }, 
  { id: 'ion-funnel-outline', component: () => import('@iconify/icons-ion/funnel-outline') }, 
  { id: 'ion-megaphone-outline', component: () => import('@iconify/icons-ion/megaphone-outline') }, 
  { id: 'ion-chatbox-outline', component: () => import('@iconify/icons-ion/chatbox-outline') }, 
  { id: 'ion-exit-outline', component: () => import('@iconify/icons-ion/exit-outline') }, 

  //feather
  { id: 'feather-settings', component: () => import('@iconify/icons-feather/settings') }, 

  

]

ICONIFY_ICONS.forEach((icon) => {
  icon.component().then(component => {
    console.log('addIcon', icon.id)
    IconifyIcon.addIcon(icon.id, component.default)
  })
})

Vue.use(IconifyIcon)
