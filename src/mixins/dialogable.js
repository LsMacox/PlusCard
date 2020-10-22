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
          console.log('dialogable update:value', val)
            this.dialog = !!val
        },
        dialog (val) {
          console.log('dialogable update:dialog', val)
            !!val !== this.value && this.$emit('change', val)
        },
    },
    methods: {
        close () {
            this.dialog = false
        },
    },
}
