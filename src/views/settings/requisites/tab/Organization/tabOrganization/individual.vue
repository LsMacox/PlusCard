<template>
  <div class="container-title-input">
    <v-form
      ref="form"
      v-model="valid"
    >
      <div class="mto">
        <h3 class="title-h3">
          Общая информация
        </h3>
        <base-text-field
          v-model="fullNamePartner"
          :validate-on-blur="true"
          placeholder="ФИО партнера"
          outlined
          dense
        />
        <div class="block-two-input">
          <base-text-field
            v-model="address"
            placeholder="Адрес"
            outlined
            class="mg-input-custom"
          />
<!--          <base-text-field-->
<!--            v-model="phoneFax"-->
<!--            placeholder="Телефон / факс"-->
<!--            outlined-->
<!--            class="mg-input-custom"-->
<!--          />-->
          <vue-tel-input
            v-model="phoneFax"
            class="mg-input-custom input-country"
            placeholder="Телефон / факс"
          />
        </div>
        <div class="block-two-input">
          <base-text-field
            v-model="fullNameHead"
            placeholder="ФИО партнера"
            outlined
            class="mg-input-custom"
          />
          <base-text-field
              v-model="partnerTaxID"
              placeholder="ИНН партнера"
              outlined
              class="mg-input-custom"
          />
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
  export default {
    name: 'Individual',
    data () {
      return {
        valid: false,
        fullNamePartner: '',
        address: '',
        phoneFax: '',
        partnerTaxID: '',
        fullNameHead: '',
      }
    },
  }
</script>

<style scoped>
  .mto {
    margin-top: 34px;
  }
  .title-h3 {
    margin: 0 0 24px;
  }
  .block-two-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .mg-input-custom {
    max-width: 328px;
    width: 100%;
  }
  .input-country {
    height: 45px;
    border-color: #D7D7E0;
    margin-bottom: 26px;
    border-radius: 10px;
    outline: none;
  }
  .input-country.vue-tel-input:focus-within {
    box-shadow: none;
    border-color: #4776E6;
  }
  .vti__dropdown.open {
    outline: none;
  }
</style>
