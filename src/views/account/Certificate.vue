<template>
  <v-container>
  <toolbar></toolbar>
  <certificate-table></certificate-table>
  </v-container>
</template>

<script>
  import Toolbar from '@/views/account/Toolbar'
  import CertificateTable from '@/views/account/CertificateTable'

  export default {
    name: 'Certificate',
    components: { Toolbar, CertificateTable },
  }
</script>

<style scoped>

</style>
