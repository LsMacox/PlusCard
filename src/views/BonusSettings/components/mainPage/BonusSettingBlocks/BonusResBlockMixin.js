export default {
    props: {
        globalActive: {
          type: Boolean,
          required: true,
        },
        hasChangesOutput: {
          type: Boolean,
          default: false,
        },
      },
      data () {
        return {}
    },
    computed: {

    },
    watch: {
        hasChanges (v) {
            this.$emit('update:hasChangesOutput', v)
        },
    },
    methods: {

    },
}
