const config = Object.freeze({
    date: {
        // Non-breakable space is \u00A0
        DATE_FORMAT: 'DD.MM.YYYY',
        DATETIME_FORMAT: 'DD.MM.YYYY\u00A0HH:mm:ss',
        DATETIME_FORMAT_MIN: 'DD.MM.YYYY\u00A0HH:mm',
        DATETIME_FORMAT_MIN2: 'DD.MM.YYYY\u00A0в\u00A0HH:mm',
    },
    tooltipButtonDelay: 1000,
    tooltipDelay: 500,
    MAX_TRAN_VALUE: 1000000,
    MAX_DAYS: 999,
})

export { config }

export default {
    install (Vue) {
        Vue.prototype.$config = config
    },
}
