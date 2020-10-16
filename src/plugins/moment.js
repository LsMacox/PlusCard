import moment from 'moment'
import VueMoment from 'vue-moment'
import Vue from 'vue'

require('moment/locale/ru')

// Choose Locale
moment.locale('ru')

Vue.use(VueMoment, { moment })
