<template>
  <v-container>
  <certificate-table></certificate-table>
  </v-container>
</template>

<script>
  import CertificateTable from '@/views/account/CertificateTable'

  export default {
    name: 'Certificate',
    components: { CertificateTable },
  }
</script>

<style scoped>

</style>
