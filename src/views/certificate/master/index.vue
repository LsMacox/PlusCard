<template lang="">
  <div style="height: 100%;">
    <v-row
      v-if="currentStep<3"
      no-gutters
    >
      <v-col>
        <v-row class="cert-stepper-row">
          <base-stepper
            v-model="currentStep"
            :items="stepList"
            @close="$router.back()"
          />
        </v-row>
        <v-row
          justify="center"
          class="cert-master-row"
          no-gutters
        >
          <v-col :cols="8">
            <v-carousel
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
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row
      v-else
      align="center"
      justify="center"
      style="height: 100%;"
    >
      <v-col cols="auto">
        <v-row justify="center">
          <v-col cols="auto">
            <v-img
              src="@/assets/svg/Check-3D.svg"
              width="109.62px"
              height="94px"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col style="width:502px">
            <v-row justify="center">
              <p class="title-s-bold">
                Сертификат создан!
              </p>
            </v-row>
            <v-row justify="center">
              <p
                class="body-m-regular"
                style="text-align:center;"
              >
                После того как сертификат пройдет модерацию, он станет доступен<br> для покупки в приложении Plus Cards.
              </p>
            </v-row>
            <v-row justify="center">
              <v-btn
                color="primary"
                @click="onClickNew"
              >
                <iconify-icon
                  icon="plus-circle-outlined"
                  height="21"
                />
                Создать еще сертификат
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
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
        createCertificateLoading: false,
        currentStep: 0,
        cert: null,
      }
    },
    computed: {
      ...mapGetters('company/program', ['program']),
    },
    created () {
      this.stepList = stepList
      this.cert = Object.assign({}, this.DEFAULT_CERT)
    },
    methods: {
      init () {
        this.cert = Object.assign({}, this.DEFAULT_CERT)
        this.currentStep = 0
      },
      onClickNew () {
        this.init()
      },

    },
  }
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.cert-stepper-row {
  position: fixed;
  width: 100%;
  margin: $page-content-padding-disable;
  padding: $page-content-padding;
  background: $material-light-backgroung-color;
  z-index: 200;

}

.cert-master-row {
  margin-top: $page-content-padding-size;
}
</style>
