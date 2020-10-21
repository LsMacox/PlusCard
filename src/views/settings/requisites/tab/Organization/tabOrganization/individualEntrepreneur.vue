<template>
  <div class="container-title-input">
    <v-form
      ref="form"
      v-model="details.valid"
    >
      <div class="mto">
        <h3 class="title-h3">
          Общая информация
        </h3>
        <base-text-field
          v-model="details.legalName"
          :validate-on-blur="true"
          placeholder="Юридическое название организации"
          outlined
          maxlength="255"
          :rules="[
                  v => !!v || 'Поле обязательно',
                ]"
          dense
        />
        <div class="block-two-input">
          <base-text-field
            v-model="details.address"
            placeholder="Адрес"
            outlined
            maxlength="255"
            :rules="[
                  v => !!v || 'Поле обязательно',
                ]"
            class="mg-input-custom"
          />
<!--          <base-text-field-->
<!--            v-model="phoneFax"-->
<!--            placeholder="Телефон / факс"-->
<!--            outlined-->
<!--            class="mg-input-custom"-->
<!--          />-->
          <vue-tel-input
            v-model="details.phoneFax"
            class="mg-input-custom input-country"
            placeholder="Телефон / факс"
            :maxLen="12"
          />
        </div>
        <div class="simple-width-md-a">
          <base-text-field
            v-model="details.fullNameHead"
            placeholder="ФИО партнера"
            outlinedclass="mg-input-custom"
            maxlength="255"
            :rules="[
                  v => !!v || 'Поле обязательно',
                ]"
          />
        </div>
      </div>
      <div>
        <h3 style="margin-top: 0!important;">
          Реквизиты
        </h3>
        <div class="block-two-input">
          <div class="simple-width-md mr-20">
            <p class="desc-13 color-text-dark font-weight-600">
              ОГРНИП
            </p>
            <base-text-field
              v-model="details.enterBin"
              placeholder="Введите ОГРНИП"
              outlined
              maxlength="15"
              :rules="[
                    v => !!v || 'Поле обязательно',
                    v => !!isNumber(v, 'enterBin') || ''
              ]"
            />
          </div>
          <div class="simple-width-md">
            <p class="desc-13 color-text-dark font-weight-600">
              ИНН
            </p>
            <base-text-field
              v-model="details.enterTin"
              placeholder="Введите ИНН"
              outlined
              maxlength="12"
              :rules="[
                    v => !!v || 'Поле обязательно',
                    v => !!isNumber(v, 'enterTin') || ''
              ]"
            />
          </div>
        </div>
        <div class="block-two-input" style="margin-bottom: 64px">
          <div class="simple-width-md mr-20">
            <p class="desc-13 color-text-dark font-weight-600">
              Расчетный счет
            </p>
            <base-text-field
              v-model="details.correspondentAccount"
              placeholder="Введите № расчетного счета"
              outlined
              maxlength="20"
              :rules="[
                    v => !!v || 'Поле обязательно',
                    v => !!isNumber(v, 'correspondentAccount') || ''
              ]"
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
        details: {
          valid: false,
          legalName: '',
          address: '',
          phoneFax: '',
          positionOfHead: '',
          fullNameHead: '',
          enterBin: '',
          enterTin: '',
          enterCheckpoint: '',
          checkingAccount: '',
          enterBic: '',
          bankName: '',
          correspondentAccount: '',
          org_type: 'IP',
        },
      }
    },
    computed: {
      requisites () {
        return this.$store.getters['settings/organization/requisites']
      },
      merchant () {
        return this.$store.getters['settings/organization/merchant']
      },
    },
    watch: {
      merchant (v) {
        this.details = this.requisites
        this.details.org_type = 'IP'
      },
      details: {
        handler (v) {
          this.$store.commit('settings/organization/requisites', v)
        },
        deep: true,
      },
    },
    methods: {
      isNumber: function (v, field) {
        var reg = new RegExp('^[\\+\\-]?\\d*\\.?\\d+(?:[Ee][\\+\\-]?\\d+)?$')
        if (reg.test(v) === false) {
          this.details[field] = ''
        }
        return reg.test(v)
      },
    },
    mounted () {
      this.details = this.requisites
      this.details.org_type = 'IP'
    },
  }
</script>

<style scoped>
  .mto {
    margin-top: 34px;
    margin-bottom: 26px;
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
    margin-top: 24px;
  }
  .simple-width-md-a {
    max-width: 328px;
    width: 100%;
  }
  .simple-width-md {
    max-width: 328px;
    width: 100%;
    margin-top: 24px;
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
    margin-top: 26px;
  }
  .input-country.vue-tel-input:focus-within {
    box-shadow: none;
    border-color: #4776E6;
  }
  .vti__dropdown.open {
    outline: none;
  }
</style>
