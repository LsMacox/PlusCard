export default {
    methods: {
        toRoute (path) {
            if (this.$route.path !== path) this.$router.push(path)
        },
    },
}
