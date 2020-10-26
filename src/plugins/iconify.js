import Vue from 'vue'
import IconifyIcon from '@iconify/vue'

// https://iconify.design/icon-sets/?query=plus-circle
// npm i @iconify/icons-bx -D
// npm i @iconify/icons-codicon -D
// npm i @iconify/icons-ant-design -D
// npm i @iconify/icons-entypo -D
// npm i @iconify/icons-ls -D
export const ICONIFY_ICONS = {
    // uil
    'plus-circle': () => import('@iconify/icons-uil/plus-circle'),

    // ant-design
    'plus-circle-outlined': () => import('@iconify/icons-ant-design/plus-circle-outlined'),
    'search-outlined': () => import('@iconify/icons-ant-design/search-outlined'),
    'ant-design-gift-outlined': () => import('@iconify/icons-ant-design/gift-outlined'),
    'ant-design-youtube-filled': () => import('@iconify/icons-ant-design/youtube-filled'),
    'question-circle-outlined': () => import('@iconify/icons-ant-design/question-circle-outlined'),

    // bi
    'arrow-left': () => import('@iconify/icons-bi/arrow-left'),
    'bi-phone': () => import('@iconify/icons-bi/phone'),

    // bx
    'bx-bx-ruble': () => import('@iconify/icons-bx/bx-ruble'),
    'bx-check': () => import('@iconify/icons-bx/bx-check'),
    'arrow-back': () => import('@iconify/icons-bx/bx-arrow-back'),
    'bx-bx-building-house': () => import('@iconify/icons-bx/bx-building-house'),

    // codicon
    'chrome-close': () => import('@iconify/icons-codicon/chrome-close'),

    // jam
    'jam-close': () => import('@iconify/icons-jam/close'),

    // carbon
    'carbon-email': () => import('@iconify/icons-carbon/email'),
    'carbon-diagram': () => import('@iconify/icons-carbon/diagram'),

    // entypo
    'chevron-right': () => import('@iconify/icons-entypo/chevron-right'),

    // ion
    'ion-checkmark-done': () => import('@iconify/icons-ion/checkmark-done'),
    'ion-close': () => import('@iconify/icons-ion/close'),
    'ion-archive-outline': () => import('@iconify/icons-ion/archive-outline'),
    'ion-close-circle-outline': () => import('@iconify/icons-ion/close-circle-outline'),
    'ion-checkmark-circle-outline': () => import('@iconify/icons-ion/checkmark-circle-outline'),
    'ion-stats-chart': () => import('@iconify/icons-ion/stats-chart'),
    'ion-wallet-outline': () => import('@iconify/icons-ion/wallet-outline'),
    'ion-funnel-outline': () => import('@iconify/icons-ion/funnel-outline'),
    'ion-megaphone-outline': () => import('@iconify/icons-ion/megaphone-outline'),
    'ion-chatbox-outline': () => import('@iconify/icons-ion/chatbox-outline'),
    'ion-exit-outline': () => import('@iconify/icons-ion/exit-outline'),
    'ion-color-fill-outline': () => import('@iconify/icons-ion/color-fill-outline'),
    'ion-document-outline': () => import('@iconify/icons-ion/document-outline'),
    'ion-logo-vk': () => import('@iconify/icons-ion/logo-vk'),
    'ion-logo-instagram': () => import('@iconify/icons-ion/logo-instagram'),
    'ion-location-outline': () => import('@iconify/icons-ion/location-outline'),
    'ion-qr-code-outline': () => import('@iconify/icons-ion/qr-code-outline'),
    'ion-mail-outline': () => import('@iconify/icons-ion/mail-outline'),
    'ion-phone-portrait-outline': () => import('@iconify/icons-ion/phone-portrait-outline'),
    'ion-barcode-outline': () => import('@iconify/icons-ion/barcode-outline'),
    'ion-warning': () => import('@iconify/icons-ion/warning'),
    'ion-attach': () => import('@iconify/icons-ion/attach-outline'),

    // feather
    'feather-refresh-ccw': () => import('@iconify/icons-feather/refresh-ccw'),
    'feather-settings': () => import('@iconify/icons-feather/settings'),
    'feather-trash': () => import('@iconify/icons-feather/trash'),
    'feather-download': () => import('@iconify/icons-feather/download'),
    'feather-chevron-down': () => import('@iconify/icons-feather/chevron-down'),
    'feather-chevron-up': () => import('@iconify/icons-feather/chevron-up'),
    'feather-phone': () => import('@iconify/icons-feather/phone'),
    'feather-mouse-pointer': () => import('@iconify/icons-feather/mouse-pointer'),
    'feather-more-vertical': () => import('@iconify/icons-feather/more-vertical'),
    'feather-calendar': () => import('@iconify/icons-feather/calendar'),
    'feather-clock': () => import('@iconify/icons-feather/clock'),
    'feather-coffee': () => import('@iconify/icons-feather/coffee'),
    'feather-plus-circle': () => import('@iconify/icons-feather/plus-circle'),
    'feather-edit': () => import('@iconify/icons-feather/edit'),
    'feather-users': () => import('@iconify/icons-feather/users'),
    'feather-shopping-bag': () => import('@iconify/icons-feather/shopping-bag'),
    'feather-copy': () => import('@iconify/icons-feather/copy'),
    'feather-credit-card': () => import('@iconify/icons-feather/credit-card'),
    'feather-minus': () => import('@iconify/icons-feather/minus'),

    // la
    'la-facebook-f': () => import('@iconify/icons-la/facebook-f'),

     // ls
    'ls-sort': () => import('@iconify/icons-ls/sort'),

    // octicon
    'octicon-chevron-up-16': () => import('@iconify/icons-octicon/chevron-up-16'),
    'check-circle': () => import('@iconify/icons-octicon/check-circle-24'),
    'octicon-triangle-up-24': () => import('@iconify/icons-octicon/triangle-up-24'),
    'octicon-triangle-down-24': () => import('@iconify/icons-octicon/triangle-down-24'),
    'octicon-check-16': () => import('@iconify/icons-octicon/check-16'),

    // si-glyph
    'si-glyph-triangle-down': () => import('@iconify/icons-si-glyph/triangle-down'),
    'si-glyph-triangle-up': () => import('@iconify/icons-si-glyph/triangle-up'),

    // eva
    'eva-plus-outline': () => import('@iconify/icons-eva/plus-outline'),
}

for (const icon in ICONIFY_ICONS) {
    // console.log('get icon', icon)
    ICONIFY_ICONS[icon]().then((component) => {
        // console.log('addIcon', icon)
        IconifyIcon.addIcon(icon, component.default)
    })
  }

Vue.use(IconifyIcon)
