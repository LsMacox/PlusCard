import date from './date'
import app from './app'

// console.log('app', app)

const config = Object.freeze({
    app,
    date,
    tooltipButtonDelay: 1000,
    tooltipDelay: 500,
    MAX_TRAN_VALUE: 1000000,
    MAX_DAYS: 999,
})

export { app, date, config }

export default {
    install (Vue) {
        Vue.prototype.$config = config
    },
}
