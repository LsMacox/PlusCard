import date from './date'
import app from './app'
import yandexMap from './yandex-map'

// console.log('app', app)

const config = Object.freeze({
    app,
    date,
    yandexMap,
    tooltipButtonDelay: 1000,
    tooltipDelay: 500,
    MAX_TRAN_VALUE: 1000000,
    MAX_DAYS: 999,
})


export { app, date, yandexMap, config }

export default {
    config,
    install (Vue) {
        Vue.prototype.$config = config
    },
}
