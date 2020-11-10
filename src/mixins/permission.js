export default {
    name: 'permission',

    props: {

    },
    data () {
        return {

        }
    },

    methods: {
        hasProgramPermission (permission, programId) {
            return this.$store.getters.user && this.$store.getters.user.hasProgramPermission(permission, programId)
        },
    },
}
