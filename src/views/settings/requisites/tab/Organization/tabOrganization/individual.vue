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
        <!--        <base-text-field-->
        <!--            v-model="details.legalName"-->
        <!--            :validate-on-blur="true"-->
        <!--            placeholder="Юридическое название организации"-->
        <!--            outlined-->
        <!--            dense-->
        <!--        />-->
        <div class="block-two-input">
          <base-text-field
            v-model="details.address"
            placeholder="Адрес"
            outlined
            class="mg-input-custom"
            maxlength="255"
            :rules="[
              v => !!v || 'Поле обязательно',
            ]"
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
            :max-len="12"
          />
        </div>
        <div class="block-two-input" style="margin-bottom: 64px">
          <base-text-field
            v-model="details.fullNameHead"
            placeholder="ФИО партнера"
            outlined
            class="mg-input-custom"
            maxlength="255"
            :rules="[
              v => !!v || 'Поле обязательно',
            ]"
          />
          <base-text-field
            v-model="details.enterTin"
            placeholder="ИНН партнера"
            outlined
            class="mg-input-custom"
            maxlength="12"
            :rules="[
              v => !!v || 'Поле обязательно',
              v => !!isNumber(v) || ''
            ]"
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
          org_type: 'FL',
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
        this.details.org_type = 'FL'
      },
      details: {
        handler (v) {
          this.$store.commit('settings/organization/requisites', v)
        },
        deep: true,
      },
    },
    mounted () {
      this.details = this.requisites
      this.details.org_type = 'FL'
    },
    methods: {
      isNumber: function (v) {
        var reg = new RegExp('^[\\+\\-]?\\d*\\.?\\d+(?:[Ee][\\+\\-]?\\d+)?$')
        if (reg.test(v) === false) {
          this.details.enterTin = ''
        }
        return reg.test(v)
      },
    },
  }
</script>

<style scoped>
  .mto {
    margin-top: 34px;
    margin-bottom: 26px;
  }
  .title-h3 {
    //margin: 0 0 24px;
    margin: 0;
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
