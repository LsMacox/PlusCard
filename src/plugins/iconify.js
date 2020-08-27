import Vue from 'vue'
import IconifyIcon from '@iconify/vue'

// https://iconify.design/icon-sets/?query=plus-circle
// npm i @iconify/icons-bx -D
// npm i @iconify/icons-codicon -D
export const ICONIFY_ICONS = [
  { id: 'plus-circle', component: () => import('@iconify/icons-uil/plus-circle') },
  { id: 'plus-circle-outlined', component: () => import('@iconify/icons-ant-design/plus-circle-outlined') },
  { id: 'bx-check', component: () => import('@iconify/icons-bx/bx-check') },
  { id: 'chrome-close', component: () => import('@iconify/icons-codicon/chrome-close') },
]

ICONIFY_ICONS.forEach((icon) => {
  icon.component().then(component => {
    console.log('addIcon', icon.id)
    IconifyIcon.addIcon(icon.id, component.default)
  })
})

Vue.use(IconifyIcon)
