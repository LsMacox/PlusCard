<template lang="">
  <div
    v-if="currentStep<3"
    style="height: 100%;"
  >
    <v-row no-gutters>
      <v-col>
        <base-stepper
          v-model="currentStep"
          :items="stepList"
          @close="$router.back()"
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
                <v-carousel
                  v-if="cert"
                  v-model="currentStep"
                  :light="true"
                  hide-delimiters
                  :show-arrows="false"
                  height="100%"
                >
                  <v-carousel-item>
                    <step-main
                      v-model="cert"
                      @continue="currentStep=1"
                    />
                  </v-carousel-item>
                  <v-carousel-item>
                    <step-rules
                      v-model="cert"
                      @continue="currentStep=2"
                    />
                  </v-carousel-item>
                  <v-carousel-item>
                    <step-nominals
                      v-model="cert"
                      @continue="currentStep=3"
                    />
                  </v-carousel-item>
                </v-carousel>
                </v-skeleton-loader>
              </v-col>
            
          </v-row>
        </base-stepper>
      </v-col>
    </v-row>
  </div>
  <base-empty-block-page
    v-else
    title="Сертификат обновлен!"
    action-icon="$iconify_ant-design-gift-outlined"
    action-text="Выпустить сертификат"
    :action="false"
    @action=""
  >
    <template v-slot:image>
      <v-img
        src="@/assets/svg/Check-3D.svg"
        width="109.62px"
        height="94px"
      />
    </template>
    <template v-slot:description>
      <span>TODO</span>
    </template>
  </base-empty-block-page>
</template>

<script>
  import { mapGetters } from 'vuex'

  import StepMain from './Step1Main'
  import StepRules from './Step2Rules'
  import StepNominals from './Step3Nominals'

  const stepList = [
    { title: 'Общая информация' },
    { title: 'Правила использования' },
    { title: 'Номиналы' },
  ]

  export default {
    components: { StepMain, StepNominals, StepRules },
    props: {
      certId: {
        type: Number,
        required: true,
      },
      startStep: {
        type: Number,
        default: 0,
      },
    },
    constants: {
      DEFAULT_CERT: {
        name: '',
        short_description: '',
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
        currentStep: this.startStep,
        GetCertAction: false,
        cert: null,
      }
    },
    computed: {
      ...mapGetters('company/program', ['program']),
    },
    created () {
      this.stepList = stepList
      this.init()
    },
    methods: {
      async init () {
        try {
          this.GetCertAction = true
          this.cert = await this.$store.dispatch('certificates/certificate/GetCert', this.certId)
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
