<template>
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
    <div class="import-stepper">
      <v-stepper
        v-model="e1"
        non-linear
        class="elevation-0"
      >
        <v-stepper-header
          class="elevation-0"
        >
          <v-stepper-step
            editable
            step="1"
          >
            Выбор файла
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            editable
            step="2"
          >
            Настройка импорта
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            step="3"
            editable
          >
            Результат
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content
            step="1"
          >
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            >
              1
            </v-card>

            <v-btn
              color="primary"
              @click="nextStep(1)"
            >
              Continue
            </v-btn>

            <v-btn text>
              Cancel
            </v-btn>
          </v-stepper-content>
          <v-stepper-content
            step="2"
          >
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            >
              2
            </v-card>

            <v-btn
              color="primary"
              @click="nextStep(2)"
            >
              Continue
            </v-btn>

            <v-btn text>
              Cancel
            </v-btn>
          </v-stepper-content>
          <v-stepper-content
            step="3"
          >
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            >
              3
            </v-card>

            <v-btn
              color="primary"
              @click="nextStep(3)"
            >
              Continue
            </v-btn>

            <v-btn text>
              Cancel
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
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
  margin: 0 auto;
  max-width: 670px;
}
</style>
