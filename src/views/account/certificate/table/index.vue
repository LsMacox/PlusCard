<template>
  <v-container>
    <certificate-filter />
    <certificate-table />
  </v-container>
</template>

<script>
  import CertificateTable from './CertificateTable'
  import CertificateFilter from './Filter'

  export default {
    components: {
      CertificateFilter,
      CertificateTable,
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
