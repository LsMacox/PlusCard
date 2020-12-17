export default {
    methods: {
        getDate (date) {
            return date ? this.$moment.utc(date).local().format(this.$config.date.DATE_FORMAT) : '-'
        },
        getTime (date) {
            return (date) ? this.$moment.utc(date).local().format(this.$config.date.TIME_MIN_FORMAT) : '-'
        },
        getDateTimeMin (date) {
            return date ? this.$moment.utc(date).local().format(this.$config.date.DATETIME_FORMAT_MIN) : '-'
        },
    },
}
