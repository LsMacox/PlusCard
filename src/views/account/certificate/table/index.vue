<template>
  <div>
    <certificate-header />
    <certificate-filter />
    <certificate-table />
  </div>
</template>

<script>
  import CertificateTable from './CertificateTable'
  import CertificateFilter from './Filter'
  import CertificateHeader from './Header'

  export default {
    components: {
      CertificateFilter,
      CertificateTable,
      CertificateHeader,
    },
    props: {
    },
    data () {
      return {}
    },
    computed: {

    },
    mounted () {

    },
    methods: {

    },
  }
</script>

<style scoped>

</style>
