<template>
  <v-row no-gutters>
    <v-col>
      <v-row
        no-gutters
        style="margin-bottom: 34px;"
      >
        <v-col>
          <certificate-header />
        </v-col>
      </v-row>
      <v-row>
        <v-col><certificate-filter /></v-col>
      </v-row>
      <v-row>
        <v-col>
          <certificate-table />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
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
