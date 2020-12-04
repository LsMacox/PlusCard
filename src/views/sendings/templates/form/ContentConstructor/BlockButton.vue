<template>
  <div class="pls--pushcon-block-button">
    {{ localBlock }}<br>
    <div
      class="pls--pushcon-block-button-btn"
      :style="`background-color: ${localBlock.color}`"
      @click.stop="updateBtn = true"
    >
      {{ localBlock.text }}
    </div>
    <!-- боковая панель -->
    <side-panel
      v-model="updateBtn"
      :width="483"
      class="panel-crm panel-crm_new_client"
    >
      <div class="panel-crm__header panel-crm_new_client__header">
        <h1
          class="panel-crm__header-title panel-crm_new_client__title title-m-bold"
        >
          Редактирование блока "Кнопка"
        </h1>
      </div>
      <div class="panel-crm__body panel-crm_new_client__body">
        <v-form
          ref="panel-crm_new_client__form"
          v-model="valid"
          class="panel-crm_new_client__form"
        >
          <div class="panel-crm_segment__form-block">
            <v-row>
              <v-col
                cols="6"
                style="height: 65px"
              >
                <v-text-field
                  v-model="localBlock.name"
                  :rules="[
                    v => !!v || 'Имя обязательно',
                    v => String(v).length <= 50 || 'Имя должно быть не более 50 символов',
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
                    v => String(v).length <= 50 || 'Фамилия должна быть не более 50 символов',
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
                  v-mask="mask"
                  :rules="[
                    v => !!v || 'Номер телефона обязателен',
                  ]"
                  :error-messages="phoneErrors"
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
                  :date.sync="form.birthday"
                  class="panel-crm__form-input panel-crm_new_client__form-input"
                  type="text"
                  placeholder="Дата рождения"
                  date-format="DD.MM.YYYY"
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
  </div>
</template>

<script>
  import SidePanel from '@/components/base/SidePanel'
  import BlockMixin from './blockMixin'

  export default {
    components: {
      SidePanel,
    },
    mixins: [BlockMixin],
    props: {
      block: {
        type: Object,
        default: () => ({}),
      },
    },
    data () {
      return {
        localBlock: {},
        updateBtn: false,
      }
    },
    computed: {},
    watch: {
      block: {
        handler (v) {
          if (!this.objectComparison(v, this.localBlock)) this.initBlock(v)
        },
        deep: true,
      },
      localBlock: {
        handler (v) {
          this.updateBlock(v)
        },
        deep: true,
      },
    },
    created () {
      this.initBlock(this.block)
    },
    methods: {

    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
</style>
