<template>
  <div>
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
            dense
            maxlength="255"
            :rules="[
                  v => !!v || 'Поле обязательно',
                ]"
          />
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
            <!--            <base-text-field-->
            <!--              v-model="phoneFax"-->
            <!--              placeholder="Телефон / факс"-->
            <!--              outlined-->
            <!--              class="mg-input-custom"-->
            <!--            />-->
            <vue-tel-input
              v-model="details.phoneFax"
              class="mg-input-custom input-country"
              placeholder="Телефон / факс"
              :maxLen="12"
            />
          </div>
          <div class="block-two-input">
            <base-text-field
              v-model="details.fullNameHead"
              placeholder="ФИО руководителя"
              outlined
              class="mg-input-custom"
              maxlength="255"
              :rules="[
                  v => !!v || 'Поле обязательно',
                ]"
            />
            <base-text-field
              v-model="details.positionOfHead"
              placeholder="Должность руководителя"
              outlined
              class="mg-input-custom"
              maxlength="255"
              :rules="[
                  v => !!v || 'Поле обязательно',
                ]"
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
                Введите ОГРН
              </p>
              <base-text-field
                v-model="details.enterBin"
                placeholder="Введите ОГРН"
                outlined
                maxlength="13"
                :rules="[
                  v => !!v || 'Поле обязательно',
                ]"
              />
            </div>
            <div class="simple-width-sm mr-20">
              <p class="desc-13 color-text-dark font-weight-600">
                Введите ИНН
              </p>
              <base-text-field
                v-model="details.enterTin"
                placeholder="Введите ИНН"
                outlined
                maxlength="10"
                :rules="[
                  v => !!v || 'Поле обязательно',
                ]"
              />
            </div>
            <div class="simple-width-sm">
              <p class="desc-13 color-text-dark font-weight-600">
                Введите КПП
              </p>
              <base-text-field
                v-model="details.enterCheckpoint"
                placeholder="Введите КПП"
                outlined
                maxlength="9"
                :rules="[
                  v => !!v || 'Поле обязательно',
                ]"
              />
            </div>
          </div>
          <div class="block-two-input">
            <div class="simple-width-md mr-20">
              <p class="desc-13 color-text-dark font-weight-600">
                Расчетный счет
              </p>
              <base-text-field
                v-model="details.checkingAccount"
                placeholder="Введите № расчетного счета"
                maxlength="20"
                outlined
              />
            </div>
            <div class="simple-width-md">
              <p class="desc-13 color-text-dark font-weight-600">
                БИК
              </p>
              <base-text-field
                v-model="details.enterBic"
                placeholder="Введите БИК"
                maxlength="9"
                outlined
              />
            </div>
          </div>
          <div class="block-two-input">
            <div class="simple-width-md mr-20">
              <p class="desc-13 color-text-dark font-weight-600">
                Название банка
              </p>
              <base-text-field
                v-model="details.bankName"
                maxlength="255"
                placeholder="Введите название банка"
                outlined
                class="mg-input-custom"
              />
            </div>
            <div class="simple-width-md">
              <p class="desc-13 color-text-dark font-weight-600">
                Корреспондентский счет
              </p>
              <base-text-field
                  maxlength="20"
                  v-model="details.correspondentAccount"
                  placeholder="Введите № корреспондентского счета"
                  outlined
                  class="mg-input-custom"
              />
            </div>
          </div>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LegalEntity',
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
          org_type: 'UL',
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
        this.details.org_type = 'UL'
      },
      details: {
        handler (v) {
          this.$store.commit('settings/organization/requisites', v)
        },
        deep: true,
      },
    },
    methods: {
      validatePhone () {
        const regex = /^((\+7|7|8)+([0-9]){10})$/i;
        const str = ''
        let m

        if ((m = regex.exec(str)) !== null) {
          // The result can be accessed through the `m`-variable.
          m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`)
          })
        }
      },
    },
    mounted () {
      if (this.merchant) {
        this.details = this.requisites
        this.details.org_type = 'UL'
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
  .simple-width-sm {
    max-width: 154px;
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
