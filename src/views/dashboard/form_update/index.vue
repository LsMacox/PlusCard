<template>
  <div>
    <form-menu
      :menu="menu"
      cancel-button-text="Отменить"
      action-button-text="Сохранить"
      @cancelbutton=""
      @actionbutton=""
    />
    <div
      v-if="!loading"
    >
      <router-view />
    </div>
  </div>
</template>

<script>
  import FormMenu from './FormMenu'

  export default {
    components: {
      FormMenu,
    },
    data () {
      return {
        loading: false,
        programId: null,
      }
    },
    computed: {
      menu () {
        return [
          { name: 'Общая информация', route: `/company/${this.programId}/info` },
          { name: 'Точки продаж', route: `/company/${this.programId}/shop` },
          { name: 'Контактные данные', route: `/company/${this.programId}/contact` },
        ]
      },
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
        try {
          this.loading = true
          await this.$store.dispatch('company/program/read', { id: this.programId })
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-update.scss';
</style>
