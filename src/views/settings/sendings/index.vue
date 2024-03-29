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
                    <span
                      slot="description"
                      v-html="'Текст СМС-приглашения клиента c ссылкой на приложение {{link}}, например Ваша ссылка на Plus {{link}}<br>' +
                        'Шаблон {{link}} может использоваться в тексте приглашения только один раз'"
                    />
                    <template v-slot:input>
                      <v-textarea
                        v-model="programModelInternal.sms_text"
                        :validate-on-blur="false"
                        :rules="smsTextRules"
                        :rows="3"
                        auto-grow
                        placeholder="Пригласительное СМС-сообщение"
                        outlined
                        counter
                        maxlength="138"
                      />
                    </template>
                  </BaseMasterFieldBlock>
                  <div class="action">
                    <v-btn
                      color="secondary"
                      :loading="loading"
                      :disabled="!valid || lockPeriod"
                      @click="sendTestSms()"
                    >
                      Получить тестовую СМС
                    </v-btn>
                    <div
                      v-if="lockPeriod"
                      class="action-timer"
                    >
                      Следующая отправка возможна через {{ timerStr }}
                    </div>
                  </div>
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
        loading: false,
        saveAction: false,
        valid: false,
        ProgramReadAction: false,
        programModelInternal: {
          sms_text: '',
        },
        smsTextRules: [
          v => !!v || 'Введите пригласительное сообщение',
          v => v.length <= 138 || 'Длина смс сообщения не должна превышать 138 символов',
          v => this.getCountTemplate(v) > 0 || 'Ссылка {{link}} отсутствует в сообщении',
          v => this.getCountTemplate(v) === 1 || 'Ссылка {{link}} используется более одного раза',
        ],
        lockPeriod: false,
        timerStr: '00:00',
        timerId: null,
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
    async created () {
      await this.init()
      if (this.programModel.sms_test_send_at) {
        this.setTimer(this.programModel.sms_test_send_at)
      }
    },
    methods: {
      ...mapActions({
        ProgramRead: 'company/program/read',
        updateCRM: 'company/program/updateCRM',
        updateCRMSmsTest: 'company/program/updateCRMSmsTest',
      }),
      getEditFields (model) {
        return {
          sms_text: model.sms_text,
        }
      },
      getCountTemplate (smsText) {
        let count = 0
        let pos = smsText.indexOf('{{link}}')
        while (pos !== -1) {
          count++
          pos = smsText.indexOf('{{link}}', pos + 1)
        }
        return count
      },
      setTimer (sendAt) {
        //
        this.timerId = setInterval((sendAt) => {
          sendAt = this.$moment.utc(sendAt).local()
          const diff = this.$moment().diff(sendAt)

          console.log('TIMESTR')
          console.log(diff)
          console.log('TIMESTR')

          if (diff >= 300000) {
            clearInterval(this.timerId)
            this.lockPeriod = false
            this.timerStr = '00:00'
          } else {
            this.timerStr = this.$moment.unix((300000 - diff) / 1000).format('mm:ss')
            this.lockPeriod = true
          }
        }, 1000, sendAt)
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
      async sendTestSms () {
        try {
          this.loading = true
          const res = await this.updateCRMSmsTest({ id: this.programId, smsText: this.programModelInternal.sms_text })
          this.$store.commit('company/program/SET_PROGRAM_MODEL', res)
          this.setTimer(res.sms_test_send_at)
          this.$notify({
            title: 'Настройка рассылки компании',
            text: 'Отправлено тестовое СМС сообщение',
            type: 'success',
          })
        } finally {
          this.loading = false
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
  .action {
    display: flex;
    align-items: center;

    .action-timer {
      margin-left: 25px;
    }
  }
</style>
