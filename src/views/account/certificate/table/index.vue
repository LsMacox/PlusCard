<template>
  <div>
    <certificate-header />
    <certificate-filter disabled />
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

  export default {
    components: {
      CertificateFilter,
      CertificateTable,
      CertificateHeader,
      DummyScreen,
    },
    props: {
    },
    data () {
      return {}
    },
    computed: {
      totalCount () {
        return this.$store.getters['account/certificate/certificate/totalCount']
      },
    },
    mounted () {

    },
    methods: {

    },
  }
</script>

<style scoped>

</style>
