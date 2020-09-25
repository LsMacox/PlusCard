<template lang="">
  <v-container
    fluid
    class="program-settings"
  >
    <v-row
      justify="space-around"
      align="center"
    >
      <v-col
        cols="auto"
        class="title-m-bold neutral-900--text"
      >
        Настройка сертификатов
      </v-col>
      <!-- <v-spacer /> -->
      <v-col>
        <v-row>
          <v-col>
            <base-text-field
              v-model="search"
              :prepend-inner-icon="'$iconify_search-outlined'"
              placeholder="Поиск сертификатов"
              style="min-width: 225px"
              hide-details
            />
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary">
              <v-icon left>
                fa-plus
              </v-icon> Создать новый сертификат
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(item, index) in certificates"
        :key="index"
        cols="6"
        sm="12"
        md="6"
      >
        <program-certificate-card
          :id="item.id"
          :name="item.name"
          :description="item.short_description||item.description"
          :active.sync="item.active"
          :nominals="item.nominals"
          :moderation-status="item.moderation_status"
          :moderation-active="item.moderation_active"
          :program="program"
        />
      </v-col>
    </v-row>    
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    components: {
      ProgramCertificateCard: () => import('./components/ProgramCertificateCard'),
    },
    data () {
      return {
        search: '',

      }
    },
    watch: {
      programId (v) {
        this.loadData()
      },
    },
    computed: {
      ...mapGetters(['programId', 'program']),
      ...mapGetters('certificates/certificate', ['certificates']),

    },
    mounted () {
      this.loadData()
    },
    methods: {
      onMasterCreateCert () {
        this.$router.push({ name: 'ProgramCertificateMaster' })
      },
      loadData () {
        console.log('loadData this.programId', this.programId)
        if (!this.programId) return
        this.GetCategoryListLoading = true
        this.$store
          .dispatch('certificates/certificate/GetCertList', this.programId)
          .finally(() => {
            this.GetCategoryListLoading = false
          })
      },
    },
  }
</script>
