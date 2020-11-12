<template>
  <div>
    <div class="crm b-segment">
      <div class="crm__header b-segment__header">
        <p class="crm__header-title title-m-bold neutral-900--text">
          {{ program.name }}
        </p>

        <v-btn
          class="crm__header_new-btn"
          style="margin-right: 25px;"
          color="secondary"
          :text="true"
          :ripple="false"
          @click="toRoute('/program/accounts')"
        >
          <iconify-icon
            icon="arrow-back"
            width="21"
            style="margin-right: 5px;"
          />
          Назад
        </v-btn>
      </div>
    </div>
    <div>
      <div class="stepper-block">
        <stepper-import />
      </div>
    </div>
  </div>
</template>

<script>
  import StepperImport from '@/views/crm/client/import/StepperImport'
  import routing from '@/mixins/routing'

  export default {
    components: {
      StepperImport,
    },
    mixins: [routing],
    data () {
      return {

      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
    },
  }
</script>

<style lang="scss" scoped>
.stepper-block {
  margin: 34px auto 0 auto;
  max-width: 70%;
  @media(max-width: 1370px) {
    max-width: 90%;
  }
}
</style>
