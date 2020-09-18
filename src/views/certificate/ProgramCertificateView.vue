<template lang="">
  <v-container
    fluid
    class="program-settings"
  >
    <v-row>
      <v-col class="title-m-bold neutral-900--text">
        Настройка сертификатов
      </v-col>
      <v-spaser />
      <v-col>
        <v-row>
        <base-text-field
          v-model="search"
          :prepend-inner-icon="'$iconify_search-outlined'"
          placeholder="Поиск сертификатов"
        />
        <v-btn color="primary"> <v-icon left>fa-plus</v-icon> Создать новый сертификат</v-btn>
         </v-row>
      </v-col>


    </v-row>
    <v-row>
      <v-col>
        <program-certificate-card :name="'sdf'" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    components: {
      ProgramCertificateCard: () => import('./components/ProgramCertificateCard'),
    },
    data () {
      return {
        search: '',

      }
    },
    computed: {
      program () {
        return { id: 1 }
      },
    },
    mounted () {

    },
    methods: {
      onMasterCreateCert () {
        this.$router.push({ name: 'ProgramCertificateMaster' })
      },
      loadData () {
        this.GetCategoryListLoading = true
        this.$store
          .dispatch('certificates/certificate/GetCertList')
          .finally(() => {
            this.GetCategoryListLoading = false
          })
      },
    },
  }
</script>
