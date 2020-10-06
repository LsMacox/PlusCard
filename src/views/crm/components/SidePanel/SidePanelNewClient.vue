<template>
  <side-panel
    v-model="state"
    :width="483"
    class="panel-crm panel-crm_new_client"
  >
    <div class="panel-crm__header panel-crm_new_client__header">
      <h1
        class="panel-crm__header-title panel-crm_new_client__title title-m-bold"
      >
        Новый клиент
      </h1>
    </div>
    <div class="panel-crm__body panel-crm_new_client__body">
      <v-form
        ref="panel-crm_new_client__form"
        v-model="valid"
        class="panel-crm_new_client__form"
      >
        <div class="panel-crm_segment__form-labels">
          <p class="body-l-semibold">
            Персональные данные клиента
          </p>
          <p class="labels__sub-label body-m-regular">
            Укажите пресональные данные клиента, которые вы знаете для наиболее
            полного заполнения профиля.
          </p>
        </div>
        <div class="panel-crm_segment__form-block">
          <v-row>
            <v-col
              cols="6"
              style="height: 65px"
            >
              <v-text-field
                v-model="form.name"
                :rules="[
                  v => !!v || 'Имя обязательно',
                ]"
                class="panel-crm__form-input panel-crm_new_client__form-input"
                type="text"
                placeholder="Имя"
                outlined
              />
            </v-col>
            <v-col
              cols="6"
              style="height: 65px"
            >
              <v-text-field
                v-model="form.lastname"
                :rules="[
                  v => !!v || 'Фамилия обязательна',
                ]"
                class="panel-crm__form-input panel-crm_new_client__form-input"
                type="text"
                placeholder="Фамилия"
                outlined
              />
            </v-col>
            <v-col
              cols="6"
              style="height: 65px"
            >
              <v-text-field
                v-model="form.phone"
                :rules="[
                  v => !!v || 'Номер телефона обязателен',
                ]"
                class="panel-crm__form-input panel-crm_new_client__form-input"
                type="text"
                placeholder="Номер телефона"
                outlined
              />
            </v-col>
            <v-col
              cols="6"
              style="height: 65px"
            >
              <date-text-field
                v-model="form.birthday"
                class="panel-crm__form-input panel-crm_new_client__form-input"
                type="text"
                placeholder="Дата рождения"
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="form.sms_invite"
                class="panel-crm_new_client__switch"
                hide-details
              >
                <span
                  slot="label"
                  class="panel-crm_new_client__switch-text body-m-medium neutral-900--text"
                >Отправить смс-приглашение</span>
              </v-switch>
            </v-col>
            <v-col cols="12">
              <v-btn
                class="panel-crm_new_client__btn-add-client"
                color="primary"
                :loading="loading"
                :disabled="!valid"
                @click="addClient"
              >
                <iconify-icon
                  class="icon-check-circle"
                  icon="check-circle"
                  height="21"
                />
                <p class="body-m-semibold neutral-100--text">
                  Добавить клиента
                </p>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-form>
    </div>
  </side-panel>
</template>

<script>
  import Convertor from '@/mixins/convertor.js'
  import SidePanel from '@/components/base/SidePanel'
  import DateTextField from '@/components/base/DateTextField'

  export default {
    components: {
      SidePanel,
      DateTextField,
    },
    mixins: [Convertor],
    model: {
      prop: 'active',
      event: 'changeState',
    },
    props: {
      active: {
        type: Boolean,
      },
    },
    data () {
      return {
        valid: true,
        loading: false,
        form: {
          name: null,
          lastname: null,
          phone: null,
          birthday: null,
          sms_invite: false,
        },
        state: this.active,
      }
    },
    computed: {},
    watch: {
      active (v) {
        this.state = v
      },
      state (v) {
        this.$emit('changeState', v)
      },
    },
    created () {
    },
    mounted () {
    },
    methods: {
      async addClient () {
        try {
          this.loading = false
          const item = {
            name: this.form.name,
            lastname: this.form.lastname,
            phone: this.form.phone,
            birthday: this.form.birthday,
            sms_invite: this.form.sms_invite,
          }
          console.log(item)
        // await this.$store.dispatch('crm/client/create', item)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/crm/components/side_panels/_side-panel-new-client.scss";
</style>
