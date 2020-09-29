<template lang="">
  <v-row no-gutters>
    <v-col>
      <base-top-menu
        v-model="currentPage"
        :menu="pageList"
        :loading="saveAction"
        :show-action="!GetCertAction"
        @cancelbutton="$router.back()"
        @actionbutton="globalSave()"
      >
        <v-row
          justify="center"
          class="cert-master-row"
          no-gutters
        >
          <v-col :cols="8">
            <v-skeleton-loader
              :loading="GetCertAction"
              :style="{height: '100%', width: '100%'}"
              type="image@3, actions"
            >
              <v-row no-gutters>
                <v-tabs-items
                  v-if="cert"
                  v-model="currentPage"
                >
                  <v-tab-item
                    :value="0"
                    eager
                  >
                    <page-main
                      ref="PageMain"
                      v-model="cert"
                    />
                  </v-tab-item>
                  <v-tab-item
                    :value="1"
                    eager
                  >
                    <page-rules
                      ref="PageRules"
                      v-model="cert"
                    />
                  </v-tab-item>
                  <v-tab-item
                    :value="2"
                    eager
                  >
                    <page-nominals
                      ref="PageNominals"
                      v-model="cert"
                    />
                  </v-tab-item>
                </v-tabs-items>

                <!-- <v-carousel
                  v-if="cert "
                  v-model="currentPage"
                  :light="true"
                  hide-delimiters
                  :show-arrows="false"
                  height="100%"
                >
                  <v-carousel-item eager>
                    <page-main
                      ref="PageMain"
                      v-model="cert"
                    />
                  </v-carousel-item>
                  <v-carousel-item eager>
                    <page-rules
                      ref="PageRules"
                      v-model="cert"
                    />
                  </v-carousel-item>
                  <v-carousel-item eager>
                    <page-nominals
                      ref="PageNominals"
                      v-model="cert"
                    />
                  </v-carousel-item>
                </v-carousel> -->
              </v-row>
            </v-skeleton-loader>
          </v-col>
        </v-row>
      </base-top-menu>
    </v-col>
  </v-row>
</template>

<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      PageMain: () => import('./PageMain'),
      PageRules: () => import('./PageRules'),
      PageNominals: () => import('./PageNominals'),

    },
    props: {
      certId: {
        type: Number,
        required: true,
      },
      startPage: {
        type: String,
        default: 'main',
      },
    },
    constants: {

      DEFAULT_CERT: {
        name: '',
        // short_description: '',
        description: '',
        category_id_list: [],
        certificate_usage_type: 'Everywhere',
        guaranteed_period_unlimit: true,
        guaranteed_period: null,
        quantity_unlimit: true,
        nominals: [
          {
            nominal_name: '',
            selling_price: null,
            quantity: null,
          },
        ],
      },
    },
    data () {
      return {
        saveAction: false,
        currentPage: 0,
        GetCertAction: false,
        cert: null,
        pageList: [
          { id: 'main', name: 'Общая информация', route: `/program/certificate/${this.certId}/main` },
          { id: 'rules', name: 'Правила использования', route: `/program/certificate/${this.certId}/rules` },
          { id: 'nominals', name: 'Номиналы', route: `/program/certificate/${this.certId}/nominals` },
        ],
      }
    },
    computed: {
      ...mapGetters('company/program', ['program']),
      saveCertData () {
        return {
          id: this.cert.id,

          name: this.cert.name,
          short_description: this.cert.short_description,
          description: this.cert.description,
          category_id_list: this.cert.category_id_list,
          // nominals: this.filterNominals, todo
          tags: this.cert.tags,
          terms_of_use: this.cert.terms_of_use,
          certificate_usage_type: this.cert.certificate_usage_type,
          guaranteed_period: this.cert.guaranteed_period_unlimit
            ? null
            : this.cert.guaranteed_period,

        }
      },
    },
    created () {
      // this.pageList = pageList
      this.setItemById(this.startPage)
      console.log('this.currentPage', this.currentPage)
      this.init()
    },
    methods: {
      setItemById (id) {
        const index = this.pageList.findIndex(x => x.id === id)
        this.currentPage = (index >= 0 ? index : 0)
      },
      async globalSave () {
        console.log('globalSave')
        try {
          this.saveAction = true
          // TODO run save
          if (!this.$refs.PageMain.validate()) {
            console.log('invalid PageMain')
            this.setItemById('main')
            return
          }
          console.log('this.$refs.PageRules', this.$refs.PageRules)
          if (!this.$refs.PageRules.validate()) {
            console.log('invalid PageRules')
            this.setItemById('rules')
            return
          }
          console.log('this.$refs.PageNominals', this.$refs.PageNominals)
          if (!this.$refs.PageNominals.validate()) {
            console.log('invalid PageNominals')
            this.setItemById('nominals')
            return
          }

          console.log('valid ')
          await this.$store.dispatch('certificates/certificate/UpdateCertificate', this.saveCertData)
          // await this.$sleep(1000)

          this.$notify({
            title: 'Обновление сертификата',
            text: 'Изменения отправлены на модерацию',
            type: 'success',
          })
        } catch (error) {

        } finally {
          this.saveAction = false
        }
      },
      async init () {
        try {
          this.GetCertAction = true
          this.cert = await this.$store.dispatch('certificates/certificate/GetCert', this.certId)
          Vue.set(this.cert, 'guaranteed_period_unlimit', this.guaranteed_period == null)
          console.log('cert=', this.cert)
        } finally {
          this.GetCertAction = false
        }
      },

    },
  }
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.cert-master-row {
  margin-top: $page-content-padding-size;
}
</style>
