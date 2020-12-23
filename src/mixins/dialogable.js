export default {
    name: 'dialogable',
    model: {
        prop: 'value',
        event: 'change',
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            dialog: !!this.value,
        }
    },

    watch: {
        value (val) {
            this.dialog = !!val
        },
        dialog (val) {
            !!val !== this.value && this.$emit('change', val)
        },
    },
    methods: {
        close (submit = false) {
            this.$emit('close', submit)
            this.dialog = false
        },
    },
}
