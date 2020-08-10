import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from 'pluscards_ui_kit/lib/locale/en'
import ru from 'pluscards_ui_kit/lib/locale/ru'

Vue.use(VueI18n)

const messages = {
  en: {
    ...require('@/locales/en.json'),
    $vuetify: en,
  },
  ru: {
    ...require('@/locales/ru.json'),
    $vuetify: ru,
  },
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages,
})
