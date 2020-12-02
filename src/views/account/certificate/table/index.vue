<template>
  <div>
    <certificate-header />
    <widget-line />
    <certificate-filter />
    <certificate-table v-show="totalCount > 0" />
    <div
      v-show="totalCount <= 0"
    >
      <dummy-screen />
    </div>
  </div>
</template>

<script>
  import CertificateTable from './CertificateTable'
  import CertificateFilter from './Filter'
  import CertificateHeader from './Header'
  import DummyScreen from '@/views/loyalty/DummyScreen'
  import WidgetLine from '@/views/account/certificate/widget/index'

  export default {
    components: {
      CertificateFilter,
      CertificateTable,
      CertificateHeader,
      DummyScreen,
      WidgetLine,
    },
    props: {
    },
    data () {
      return {}
    },
    computed: {
      loadingRequest () {
        return this.$store.getters['template/shared/loadingRequest']
      },
      loadingApp () {
        return this.$store.getters['template/shared/loadingApp']
      },
      programs () {
        return this.$store.getters['company/program/programs']
      },
      program () {
        return this.$store.getters['company/program/program']
      },
      period () {
        return this.$store.getters['widget/filter/period']
      },
      filter () {
        return this.$store.getters['account/certificate/filter/filter']
      },
      totalCount () {
        return this.$store.getters['account/certificate/certificate/totalCount']
      },
    },
    watch: {
      'program.id' (v) {
        if (v) {
          this.fetchData()
        }
      },
      filter (v) {
        if (v) {
          this.fetchData()
        }
      },
      period (v) {
        if (v) {
          this.fetchData()
        }
      },
    },
    async created () {
      await this.fetchData()
    },
    methods: {
      async fetchData () {
        console.log('fetchData ALL')
        console.log(this.period)
        try {
          if (this.program.id) {
            this.loading = true
            const widget = {
              program_id: this.program.id,
              start_period: this.period.start,
              end_period: this.period.end,
              filter: this.filter,
            }
            await this.$store.dispatch('account/certificate/certificate/list', widget)
          }
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style scoped>

</style>
