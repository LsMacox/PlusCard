<template>
  <div>
    <div class="crm b-segment">
      <div class="crm__header b-segment__header">
        <p class="crm__header-title title-m-bold neutral-900--text">
          {{ program.name }}
        </p>
        <!--
      <v-btn
        class="crm__header_new-btn"
        color="primary"
        @click="sidePanelCategoryStatus = true"
      >
        <iconify-icon
          icon="plus-circle"
          width="21"
        />
        <p
          class="body-m-semibold neutral-100--text"
        >
          категории
        </p>
      </v-btn>
      -->
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
      <div class="import-stepper">
        //
      </div>
    </div>
  </div>
</template>

<script>
  import routing from '@/mixins/routing'

  export default {
    mixins: [routing],
    data () {
      return {
        e1: 1,
        steps: 3,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      step () {
        return this.$store.getters['crm/excel_import/step']
      },
    },
    methods: {
      nextStep (n) {
        if (n === this.steps) {
          this.e1 = 1
        } else {
          this.e1 = n + 1
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.import-stepper {
  margin: 34px auto 0 auto;
  max-width: 70%;
  @media(max-width: 1370px) {
    max-width: 90%;
  }
}
</style>
