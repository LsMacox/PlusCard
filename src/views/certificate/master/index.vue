<template lang="">
  <v-container>
    <v-row>
      <base-stepper
        v-model="currentStep"
        :items="stepList"
      />
    </v-row>
    <v-row>
      <v-carousel
        v-model="currentStep"
        :light="true"
        hide-delimiters
        :show-arrows="false"
        height="100%"
      >
        <v-carousel-item >
          <step-main
            v-model="cert"
            @continue="currentStep=1"
          />
        </v-carousel-item>
        <v-carousel-item>
          <step-rules  v-model="cert" @continue="currentStep=2" />
        </v-carousel-item>
        <v-carousel-item>
          <step-nominals  v-model="cert" @continue="currentStep=0" />
        </v-carousel-item>
      </v-carousel>

      {{ currentStep }}
      {{ cert }}
    </v-row>
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
        },

      }
    },
    computed: {

    },
    created () {
      this.stepList = stepList
    },
  }
</script>
