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
      >
        <v-carousel-item>
          <step-main @continue="currentStep=1" />
        </v-carousel-item>
        <v-carousel-item>
          <step-rules @continue="currentStep=2" />
        </v-carousel-item>
        <v-carousel-item>
          <step-nominals @continue="currentStep=0" />
        </v-carousel-item>
      </v-carousel>

      {{ currentStep }}
    </v-row>
  </v-container>
</template>

<script>
  import StepMain from './StepMain'
  import StepNominals from './StepNominals'
  import StepRules from './StepRules'

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

      }
    },
    computed: {

    },
    created () {
      this.stepList = stepList
    },
  }
</script>
