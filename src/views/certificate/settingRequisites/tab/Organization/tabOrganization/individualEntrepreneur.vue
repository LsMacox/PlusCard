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
          v-model="legalName"
          :validate-on-blur="true"
          placeholder="Юридическое название организации"
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
        <div class="simple-width-md">
          <base-text-field
            v-model="fullNameHead"
            placeholder="ФИО партнера"
            outlinedclass="mg-input-custom"
          />
        </div>
      </div>
      <div>
        <h3 class="title-h3">
          Реквизиты
        </h3>
        <div class="block-two-input">
          <div class="simple-width-md mr-20">
            <p class="desc-13 color-text-dark font-weight-600">
              ОГРНИП
            </p>
            <base-text-field
              v-model="enterOgrnip"
              placeholder="Введите ОГРНИП"
              outlined
            />
          </div>
          <div class="simple-width-md">
            <p class="desc-13 color-text-dark font-weight-600">
              ИНН
            </p>
            <base-text-field
              v-model="enterTin"
              placeholder="Введите ИНН"
              outlined
            />
          </div>
        </div>
        <div class="block-two-input">
          <div class="simple-width-md mr-20">
            <p class="desc-13 color-text-dark font-weight-600">
              Расчетный счет
            </p>
            <base-text-field
              v-model="bankName"
              placeholder="Введите № расчетного счета"
              outlined
            />
          </div>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
  export default {
    name: 'IndividualEntrepreneur',
    data () {
      return {
        valid: false,
        legalName: '',
        address: '',
        phoneFax: '',
        fullNameHead: '',
        enterOgrnip: '',
        enterTin: '',
        bankName: '',
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
  .mr-20 {
    margin-right: 20px;
  }
  .simple-width-md {
    max-width: 328px;
    width: 100%;
  }
  .desc-13 {
    margin-bottom: 8px!important;
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
