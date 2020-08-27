import Vue from 'vue'
import IconifyIcon from '@iconify/vue'

//https://iconify.design/icon-sets/?query=plus-circle
export const ICONIFY_ICONS = [
  { id: 'plus-circle', component: () => import('@iconify/icons-uil/plus-circle') },
  { id: 'plus-circle-outlined', component: () => import('@iconify/icons-ant-design/plus-circle-outlined') },
  { id: 'ion-close', component: () => import('@iconify/icons-ion/close') },
]

ICONIFY_ICONS.forEach((icon) => {
  icon.component().then(component => {
    console.log('addIcon', icon.id)
    IconifyIcon.addIcon(icon.id, component.default)
  })
})

Vue.use(IconifyIcon)
