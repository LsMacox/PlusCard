<template>
  <v-row no-gutters>
    <v-col>
      <base-top-menu

        :loading="saveAction"
        :show-action="hasChanges && valid"
        action-button-text="Сохранить"
        @cancelbutton="cancelEdit()"
        @actionbutton="saveChanges()"
      >
        <template v-slot:header>
          <div class="body-l-semibold neutral-900--text ">
            Настройка рассылки компании
          </div>
        </template>
        <v-row
          justify="center"
          class=""
          no-gutters
        >
          <v-col :cols="8">
            <v-skeleton-loader
              :loading="ProgramReadAction"
              :style="{height: '100%', width: '100%'}"
              type="image@3, actions"
            >
              <v-row no-gutters>
                <v-form
                  ref="form"
                  v-model="valid"
                >
                  <BaseMasterFieldBlock title="Пригласительное СМС-сообщение">
                    <span slot="description">
                      Текст СМС-приглашения клиента c ссылкой на приложение {link}, например 'Ваша ссылка на Plus {link}'
                      <br> Шаблон {link} может использоваться в тексте приглашения только один раз
                    </span>
                    <template v-slot:input>
                      <v-textarea
                        v-model="programModelInternal.sms_text"
                        :validate-on-blur="false"
                        :rules="smsTextRules"
                        :rows="3"
                        auto-grow
                        placeholder="Пригласительное СМС-сообщение"
                        outlined
                        maxlength="70"
                      />
                    </template>
                  </BaseMasterFieldBlock>
                </v-form>
              </v-row>
            </v-skeleton-loader>
          </v-col>
        </v-row>
      </base-top-menu>
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        saveAction: false,
        valid: false,
        ProgramReadAction: false,
        programModelInternal: {
          sms_text: '',
        },
        smsTextRules: [
          v => !!v || 'Введите пригласительное сообщение',
          v => v.length <= 70 || 'Длина смс не превышает 70 символов',
          v => this.getCountTemplate(v) > 0 || 'Ссылка {link} отсутствует в сообщении',
          v => this.getCountTemplate(v) === 1 || 'Ссылка {link} используется более одного раза',
        ],
      }
    },
    computed: {
      ...mapGetters({
        programId: 'programId',
        programModel: 'company/program/programModel',
      }),
      hasChanges () { return JSON.stringify(this.getEditFields(this.programModel)) !== JSON.stringify(this.getEditFields(this.programModelInternal)) },

    },
    watch: {
      programId (v) {
        !!v && this.init()
      },
    },
    created () {
      this.init()
    },
    methods: {
      ...mapActions({
        ProgramRead: 'company/program/read',
        updateCRM: 'company/program/updateCRM',
      }),
      getEditFields (model) {
        return {
          sms_text: model.sms_text,
        }
      },
      getCountTemplate (smsText) {
        let count = 0
        let pos = smsText.indexOf('{link}')
        while (pos !== -1) {
          count++
          pos = smsText.indexOf('{link}', pos + 1)
        }
        return count
      },
      async init () {
        try {
          this.ProgramReadAction = true
          await this.ProgramRead({ id: this.programId })
          this.programModelInternal = Object.copy(this.programModel)
        } catch (e) {
          console.error(e)
        } finally {
          this.ProgramReadAction = false
        }
      },
      async cancelEdit () {
        try {
          if (this.hasChanges) {
            await this.$confirm(
              'Имеются не сохраненные изменения. Закрыть без сохранения?',
              'Настройка рассылки компании',
              {
                confirmButtonText: 'Закрыть',
                cancelButtonText: 'Отмена',
                type: 'warning',
              })
          }
          this.$router.back()
        } catch (error) {

        }
      },
      async saveChanges () {
        try {
          this.saveAction = true
          await this.updateCRM({ id: this.programId, smsText: this.programModelInternal.sms_text })
          this.$notify({
            title: 'Настройка рассылки компании',
            text: 'Изменения отправлены на модерацию',
            type: 'success',
          })
        } catch (e) {
          console.error(e)
        } finally {
          this.saveAction = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
</style>
