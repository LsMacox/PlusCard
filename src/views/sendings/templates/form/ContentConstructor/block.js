export default {
    methods: {
        initBlock () {
            this.localBlock = Object.copy(this.block)
        },
        updateBlock (v) {
            this.$emit('update:block', Object.copy(v))
        },
    },
}
