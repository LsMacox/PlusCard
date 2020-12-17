<template>
  <div
    class="crm"
    style="text-align: left;"
  >
    <side-panel
      v-model="state"
      :width="483"
      class="panel-crm panel-crm_new_client"
      hide-overlay
    >
      <div class="panel-crm__header panel-crm_new_client__header">
        <h1
          class="panel-crm__header-title panel-crm_new_client__title title-m-bold"
        >
          Создание рассылки
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
                cols="12"
                style="height: 65px"
              >
                <v-text-field
                  v-model="form.name"
                  :rules="[
                    v => !!v || 'Название рассылки обязательно',
                    v => String(v).length <= 255 || 'Название рассылки должно быть не более 255 символов',
                  ]"
                  class="panel-crm__form-input panel-crm_new_client__form-input"
                  type="text"
                  placeholder="Текст кнопки"
                  outlined
                />
              </v-col>
              <v-col
                cols="12"
                style="height: 65px"
              >
                <v-select
                  v-model="form.template_id"
                  :rules="[
                    v => !!v || 'Шаблон рассылки обязателен',
                  ]"
                  :items="templates"
                  item-value="id"
                  item-text="name"
                  placeholder="Шаблон рассылки"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-btn
                  class="panel-crm_new_client__btn-add-client"
                  color="primary"
                  :loading="loading"
                  :disabled="!valid"
                  @click="create()"
                >
                  <iconify-icon
                    class="icon-check-circle"
                    icon="check-circle"
                    height="21"
                  />
                  <p class="body-m-semibold neutral-100--text">
                    Создать
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

  export default {
    components: {
      SidePanel,
    },
    model: {
      prop: 'dialog',
      event: 'changeState',
    },
    props: {
      dialog: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        valid: false,
        loading: false,
        form: {
          name: null,
          template_id: null,
        },
        state: this.dialog,
      }
    },
    computed: {
      templates () {
        return this.$store.getters['company/notifications/templates']
      },
    },
    watch: {
      dialog (v) {
        this.state = v
      },
      state (v) {
        this.$emit('changeState', v)
      },
    },
    methods: {
      close () {
        this.$emit('changeState', false)
      },
      async create () {
        try {
          this.loading = true
          const item = {
            name: this.form.name,
            template_id: this.form.template_id,
          }
          // console.log(item)
          await this.$store.dispatch('company/sendings/create', item)
          this.close()
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";
</style>
