export default {
  computed: {
    widgetRequest () {
      return {
        start_period: this.period.start,
        filter: this.filter,
        program_id: this.program.id,
        end_period: this.period.end,
      }
    },
    filter () {
      return this.$store.getters['widget/filter/filter']
    },
    period () {
      return this.$store.getters['widget/filter/period']
    },
    program () {
      // return this.$store.getters['program/program'] ?? { id: null }
      return { id: 1001 }
    },
  },
  watch: {
    filter () {
      this.fetchData()
    },
    period () {
      this.fetchData()
    },
    program () {
      this.fetchData()
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      console.log('fetch widgetRequest')
    },
  },
}
