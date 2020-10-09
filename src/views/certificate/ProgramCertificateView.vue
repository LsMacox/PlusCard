<template lang="">
  <v-skeleton-loader
    :loading="GetCertListAction"
    :style="{height: '100%', width: '100%'}"
    type="card-heading, image@3"
  >
    <v-container
      v-if="certificates.length>0"
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
                v-model.trim="search"
                :prepend-inner-icon="'$iconify_search-outlined'"
                placeholder="Поиск сертификатов"
                style="min-width: 225px"
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="primary"
                @click="onMasterCreateCert()"
              >
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
          v-for="(item, index) in filtered_certificates"
          :key="index"
          cols="6"
          sm="12"
          md="6"
        >
          <program-certificate-card
            v-if="ShowLastVersion && item.LastVersion"
            :id="item.id"
            :name="item.LastVersion.name"
            :description="item.LastVersion.description"
            :active.sync="item.active"
            :nominals="item.nominals.map(x=> x.LastVersion || x)"
            :moderation-status="item.moderation_status"
            :moderation-active="item.moderation_active"
            :program="program"
          />
          <program-certificate-card
            v-else
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
    <!-- Заглушка -->
    <base-empty-block-page
      v-else
      title="Выпустите сертификат!"
      action-icon="$iconify_ant-design-gift-outlined"
      action-text="Выпустить сертификат"
      action
      @action="onMasterCreateCert"
    >
      <template v-slot:image>
        <v-img
          src="@/assets/png/auth-side-panel-img2.png"
          width="193.96px"
          height="174px"
        />
      </template>
      <template v-slot:description>
        <span>Создавайте сертификаты для своих клиентов. Настраивайте<br>номиналы, сроки действия и правила использования.</span>
      </template>
    </base-empty-block-page>
  </v-skeleton-loader>
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
        GetCertListAction: false,
        ShowLastVersion: true,

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
      filtered_certificates () {
        if (this.search_comp) {
          return this.certificates.filter((item) =>
            item.id === +this.search_comp ||
            (item.name && item.name.toLowerCase().includes(this.search_comp)) ||
            (item.short_description && item.short_description.toLowerCase().includes(this.search_comp)),

          )
        } else {
          return this.certificates
        }
      },
      search_comp () {
        return this.search ? this.search.trim().toLowerCase() : ''
      },

    },
    created () {
      this.loadData()
    },
    mounted () {

    },
    methods: {
      onMasterCreateCert () {
        this.$router.push({ name: 'ProgramCertificateMaster' })
      },
      loadData () {
        console.log('loadData this.programId', this.programId)
        if (!this.programId) return
        this.GetCertListAction = true
        this.$store
          .dispatch('certificates/certificate/GetCertList', this.programId)
          .finally(() => {
            this.GetCertListAction = false
          })
      },
    },
  }
</script>
