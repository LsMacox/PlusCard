import Vue from 'vue'
import IconifyIcon from '@iconify/vue'

// https://iconify.design/icon-sets/?query=plus-circle
// npm i @iconify/icons-bx -D
// npm i @iconify/icons-codicon -D
// npm i @iconify/icons-ant-design -D
// npm i @iconify/icons-entypo -D
// npm i @iconify/icons-ls -D
export const ICONIFY_ICONS = [
    // uil
    {
        id: 'plus-circle',
        component: () => import('@iconify/icons-uil/plus-circle'),
    },

    // ant-design
    {
        id: 'plus-circle-outlined',
        component: () =>
            import('@iconify/icons-ant-design/plus-circle-outlined'),
    },
    {
        id: 'search-outlined',
        component: () => import('@iconify/icons-ant-design/search-outlined'),
    },
    {
        id: 'ant-design-gift-outlined',
        component: () => import('@iconify/icons-ant-design/gift-outlined'),
    },
    {
        id: 'ant-design-youtube-filled',
        component: () => import('@iconify/icons-ant-design/youtube-filled'),
    },
    {
        id: 'question-circle-outlined',
        component: () =>
            import('@iconify/icons-ant-design/question-circle-outlined'),
    },

    // bi
    {
        id: 'arrow-left',
        component: () => import('@iconify/icons-bi/arrow-left'),
    },
    { id: 'bi-phone', component: () => import('@iconify/icons-bi/phone') },

    // bx
    { id: 'bx-check', component: () => import('@iconify/icons-bx/bx-check') },
    {
        id: 'arrow-back',
        component: () => import('@iconify/icons-bx/bx-arrow-back'),
    },
    { id: 'bx-check', component: () => import('@iconify/icons-bx/bx-check') },
    {
        id: 'arrow-back',
        component: () => import('@iconify/icons-bx/bx-arrow-back'),
    },
    {
        id: 'bx-bx-building-house',
        component: () => import('@iconify/icons-bx/bx-building-house'),
    },

    // codicon
    {
        id: 'chrome-close',
        component: () => import('@iconify/icons-codicon/chrome-close'),
    },

    // jam
    { id: 'jam-close', component: () => import('@iconify/icons-jam/close') },

    // carbon
    {
        id: 'carbon-email',
        component: () => import('@iconify/icons-carbon/email'),
    },
    {
        id: 'carbon-diagram',
        component: () => import('@iconify/icons-carbon/diagram'),
    },

    // entypo
    {
        id: 'chevron-right',
        component: () => import('@iconify/icons-entypo/chevron-right'),
    },

    // ion
    { id: 'ion-close', component: () => import('@iconify/icons-ion/close') },
    { id: 'ion-archive-outline', component: () => import('@iconify/icons-ion/archive-outline') },   
    // { id: 'ion-archive-outline', component: () => import('@iconify/icons-ion/archive-outline') },   
    {
        id: 'ion-close-circle-outline',
        component: () => import('@iconify/icons-ion/close-circle-outline'),
    },
    {
        id: 'ion-checkmark-circle-outline',
        component: () => import('@iconify/icons-ion/checkmark-circle-outline'),
    },
    {
        id: 'ion-stats-chart',
        component: () => import('@iconify/icons-ion/stats-chart'),
    },
    {
        id: 'ion-wallet-outline',
        component: () => import('@iconify/icons-ion/wallet-outline'),
    },
    {
        id: 'ion-funnel-outline',
        component: () => import('@iconify/icons-ion/funnel-outline'),
    },
    {
        id: 'ion-megaphone-outline',
        component: () => import('@iconify/icons-ion/megaphone-outline'),
    },
    {
        id: 'ion-chatbox-outline',
        component: () => import('@iconify/icons-ion/chatbox-outline'),
    },
    {
        id: 'ion-exit-outline',
        component: () => import('@iconify/icons-ion/exit-outline'),
    },
    {
        id: 'ion-color-fill-outline',
        component: () => import('@iconify/icons-ion/color-fill-outline'),
    },
    {
        id: 'ion-checkmark-circle-outline',
        component: () => import('@iconify/icons-ion/checkmark-circle-outline'),
    },
    {
        id: 'ion-document-outline',
        component: () => import('@iconify/icons-ion/document-outline'),
    },
    {
        id: 'ion-logo-vk',
        component: () => import('@iconify/icons-ion/logo-vk'),
    },
    {
        id: 'ion-logo-instagram',
        component: () => import('@iconify/icons-ion/logo-instagram'),
    },
    {
        id: 'ion-location-outline',
        component: () => import('@iconify/icons-ion/location-outline'),
    },
    {
        id: 'ion-qr-code-outline',
        component: () => import('@iconify/icons-ion/qr-code-outline'),
    },
    {
        id: 'ion-mail-outline',
        component: () => import('@iconify/icons-ion/mail-outline'),
    },
    {
        id: 'ion-phone-portrait-outline',
        component: () => import('@iconify/icons-ion/phone-portrait-outline'),
    },
    {
        id: 'ion-barcode-outline',
        component: () => import('@iconify/icons-ion/barcode-outline'),
    },
    // ion
    { id: 'ion-close', component: () => import('@iconify/icons-ion/close') },
    {
        id: 'ion-close-circle-outline',
        component: () => import('@iconify/icons-ion/close-circle-outline'),
    },
    {
        id: 'ion-checkmark-circle-outline',
        component: () => import('@iconify/icons-ion/checkmark-circle-outline'),
    },
    {
        id: 'ion-stats-chart',
        component: () => import('@iconify/icons-ion/stats-chart'),
    },
    {
        id: 'ion-wallet-outline',
        component: () => import('@iconify/icons-ion/wallet-outline'),
    },
    {
        id: 'ion-funnel-outline',
        component: () => import('@iconify/icons-ion/funnel-outline'),
    },
    {
        id: 'ion-megaphone-outline',
        component: () => import('@iconify/icons-ion/megaphone-outline'),
    },
    {
        id: 'ion-chatbox-outline',
        component: () => import('@iconify/icons-ion/chatbox-outline'),
    },
    {
        id: 'ion-exit-outline',
        component: () => import('@iconify/icons-ion/exit-outline'),
    },
    {
        id: 'ion-color-fill-outline',
        component: () => import('@iconify/icons-ion/color-fill-outline'),
    },
    {
        id: 'ion-checkmark-circle-outline',
        component: () => import('@iconify/icons-ion/checkmark-circle-outline'),
    },
    {
        id: 'ion-document-outline',
        component: () => import('@iconify/icons-ion/document-outline'),
    },
    {
        id: 'ion-logo-vk',
        component: () => import('@iconify/icons-ion/logo-vk'),
    },
    {
        id: 'ion-logo-instagram',
        component: () => import('@iconify/icons-ion/logo-instagram'),
    },
    {
        id: 'ion-location-outline',
        component: () => import('@iconify/icons-ion/location-outline'),
    },
    {
        id: 'ion-qr-code-outline',
        component: () => import('@iconify/icons-ion/qr-code-outline'),
    },
    {
        id: 'ion-mail-outline',
        component: () => import('@iconify/icons-ion/mail-outline'),
    },
    {
        id: 'ion-warning',
        component: () => import('@iconify/icons-ion/warning'),
    },
    {
        id: 'ion-attach',
        component: () => import('@iconify/icons-ion/attach-outline'),
    },

    // feather
    {
        id: 'feather-settings',
        component: () => import('@iconify/icons-feather/settings'),
    },
    {
        id: 'feather-trash',
        component: () => import('@iconify/icons-feather/trash'),
    },
    {
        id: 'feather-download',
        component: () => import('@iconify/icons-feather/download'),
    },
    {
        id: 'feather-settings',
        component: () => import('@iconify/icons-feather/settings'),
    },
    {
        id: 'feather-chevron-down',
        component: () => import('@iconify/icons-feather/chevron-down'),
    },
    {
        id: 'feather-chevron-up',
        component: () => import('@iconify/icons-feather/chevron-up'),
    },
    {
        id: 'feather-phone',
        component: () => import('@iconify/icons-feather/phone'),
    },
    {
        id: 'feather-mouse-pointer',
        component: () => import('@iconify/icons-feather/mouse-pointer'),
    },
    {
        id: 'feather-more-vertical',
        component: () => import('@iconify/icons-feather/more-vertical'),
    },
    {
        id: 'feather-calendar',
        component: () => import('@iconify/icons-feather/calendar'),
    },
    {
        id: 'feather-clock',
        component: () => import('@iconify/icons-feather/clock'),
    },
    {
        id: 'feather-coffee',
        component: () => import('@iconify/icons-feather/coffee'),
    },
    {
        id: 'feather-plus-circle',
        component: () => import('@iconify/icons-feather/plus-circle'),
    },
    {
        id: 'feather-trash',
        component: () => import('@iconify/icons-feather/trash'),
    },
    {
        id: 'feather-edit',
        component: () => import('@iconify/icons-feather/edit'),
    },
    {
        id: 'feather-users',
        component: () => import('@iconify/icons-feather/users'),
    },
    {
        id: 'feather-shopping-bag',
        component: () => import('@iconify/icons-feather/shopping-bag'),
    },
    {
        id: 'feather-copy',
        component: () => import('@iconify/icons-feather/copy'),
    },
    {
        id: 'feather-credit-card',
        component: () => import('@iconify/icons-feather/credit-card'),
    },
    {
        id: 'feather-minus',
        component: () => import('@iconify/icons-feather/minus'),
    },

    // la
    {
        id: 'la-facebook-f',
        component: () => import('@iconify/icons-la/facebook-f'),
    },

    // ls
    {
        id: 'ls-sort',
        component: () => import('@iconify/icons-ls/sort'),
    },

    // octicon
    {
        id: 'octicon-chevron-up-16',
        component: () => import('@iconify/icons-octicon/chevron-up-16'),
    },
    {
        id: 'check-circle',
        component: () => import('@iconify/icons-octicon/check-circle-24'),
    },
    {
        id: 'octicon-triangle-up-24',
        component: () => import('@iconify/icons-octicon/triangle-up-24'),
    },
    {
        id: 'octicon-triangle-down-24',
        component: () => import('@iconify/icons-octicon/triangle-down-24'),
    },
    {
        id: 'octicon-check-16',
        component: () => import('@iconify/icons-octicon/check-16'),
    },

    // si-glyph
    {
        id: 'si-glyph-triangle-down',
        component: () => import('@iconify/icons-si-glyph/triangle-down'),
    },
    {
        id: 'si-glyph-triangle-up',
        component: () => import('@iconify/icons-si-glyph/triangle-up'),
    },
    // eva
    {
        id: 'eva-plus-outline',
        component: () => import('@iconify/icons-eva/plus-outline'),
    },
]

ICONIFY_ICONS.forEach((icon) => {
    icon.component().then((component) => {
        // console.log('addIcon', icon.id)
        IconifyIcon.addIcon(icon.id, component.default)
    })
})

Vue.use(IconifyIcon)
