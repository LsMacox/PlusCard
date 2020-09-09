<template>
  <div>
    <div class="stepper">
      <div
        class="stepper-block first-step body-l-semibold"
        :style="'color: ' + getCurrentColor('first')+ ';cursor: pointer;'"
        @click="toRoute(`/company/${program.id}/info`)"
      >
        Общая информация
      </div>
      <v-icon class="stepper__icon">
        mdi-chevron-right
      </v-icon>
      <div
        class="stepper-block second-step body-l-semibold"
        :style="'color: ' + getCurrentColor('second')+ ';cursor: pointer;'"
        @click="toRoute(`/company/${program.id}/shop`)"
      >
        Точки продаж
      </div>
      <v-icon class="stepper__icon">
        mdi-chevron-right
      </v-icon>
      <div
        class="stepper-block third-step body-l-semibold"
        :style="'color: ' + getCurrentColor('third')+ ';cursor: pointer;'"
        @click="toRoute(`/company/${program.id}/contact`)"
      >
        Контактные данные
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        programId: null,
      }
    },
    computed: {
    },
    async created () {
      const id = this.$route.params.program_id
      this.programId = id
      if (id !== 'new') {
        await this.fetchData()
      }
    },
    methods: {
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      getCurrentColor (step) {
        if (step === 'first') {
          if (this.currentStep <= 1) {
            return '#8E54E9'
          } else {
            return '#2A2A34'
          }
        } else if (step === 'second') {
          if (this.currentStep <= 1) {
            return '#D7D7E0'
          } else if (this.currentStep === 2) {
            return '#4776E6'
          } else {
            return '#2A2A34'
          }
        } else if (step === 'third') {
          if (this.currentStep <= 2) {
            return '#D7D7E0'
          } else if (this.currentStep === 3) {
            return '#4776E6'
          } else {
            return '#2A2A34'
          }
        }
      },
      async fetchData () {
        await this.$store.dispatch('company/program/read', { id: this.programId })
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-update.scss';
</style>
