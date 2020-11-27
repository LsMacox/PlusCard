<template>
  <div style="margin-top: 68px">
    <div class="block-title">
      <h2 class="title-h2">
        Данные организации
      </h2>
      <p class="desc-15">
        Заполните все поля формы. Нам нужна эта инфрмация для корректного выставления счетов и предоставления отчетов.
      </p>
    </div>
    <div class="radio-groups">
      <v-radio-group
        v-model="radioDefault"
        class="radio-custom-mb"
        dense
        row
      >
        <v-radio
          label="Юридическое лицо"
          class="radio-custom"
          value="legalEntity"
          on-icon="mdi-record-circle"
        />
        <v-radio
          label="Индивидуальный предприниматель"
          class="radio-custom"
          value="individualEntrepreneur"
          on-icon="mdi-record-circle"
        />
        <v-radio
          label="Физическое лицо"
          class="radio-custom"
          value="individual"
          on-icon="mdi-record-circle"
        />
      </v-radio-group>
    </div>
    <div>
      <legal-entity v-if="radioDefault === 'legalEntity'" />
      <individual-entrepreneur v-else-if="radioDefault === 'individualEntrepreneur'" />
      <individual v-else-if="radioDefault === 'individual'" />
    </div>
  </div>
</template>

<script>
  import legalEntity from './tabOrganization/legalEntity'
  import individualEntrepreneur from './tabOrganization/individualEntrepreneur'
  import individual from './tabOrganization/individual'
  export default {
    name: 'Organization',
    components: {
      legalEntity,
      individualEntrepreneur,
      individual,
    },
    data () {
      return {
        radioDefault: 'legalEntity',
      }
    },
    computed: {
      requisites () {
        return this.$store.getters['settings/organization/requisites']
      },
    },
    watch: {
      requisites (v) {
        switch (v.org_type) {
          case 'UL': this.radioDefault = 'legalEntity'; break
          case 'IP': this.radioDefault = 'individualEntrepreneur'; break
          case 'FL': this.radioDefault = 'individual'; break
          default: this.radioDefault = 'legalEntity'
        }
      },
    },
  }
</script>

<style scoped>
  .title-h2 {
    margin-bottom: 12px;
  }
  .block-title {
    margin-bottom: 34px;
  }
  .radio-groups {
    display: flex;
    align-items: center;
  }
</style>
