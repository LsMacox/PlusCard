<template lang="">
  <v-container>
    <v-row>
      <base-stepper
        v-model="currentStep"
        :items="stepList"
      />
    </v-row>
    <v-row justify="center" no-gutters>
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
              @continue="createCert"
            />
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
<!-- 
    {{ currentStep }}
    {{ cert }} -->
  </v-container>
</template>

<script>
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
    data () {
      return {
        currentStep: 0,
        cert: {
          name: '',
          category_id_list: [],
          certificate_usage_type: 'Everywhere',
          guaranteed_period_unlimit: true,
          guaranteed_period: null,
          quantity_unlimit: true,
          nominals: [{
            nominal_name: '',
            selling_price: null,
            quantity: null,
          }],
        },

      }
    },
    computed: {

    },
    created () {
      this.stepList = stepList
    },
    methods: {
      createCert () {
        console.log(this.cert)
      },
    },
  }
</script>
