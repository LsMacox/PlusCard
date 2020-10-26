<template>
  <BaseDrawerDialog
    v-model="dialog"
    title="Использование сертификата"
  >
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row>
        <v-col>
          <BaseDialogFieldBlock
            title="Введите код из смс"
            description="Введите код подтверждения, высланный вам в смс, в поле ниже чтобы отметить сертификат как использованный."
          >
            <v-row align="center">
              <v-col cols="auto">
                <BaseSmsCodeInput
                  v-model="code"
                  @confirm="certSetUsed"
                />
              </v-col>
              <v-col>
                <span
                  v-if="block_sec_left"
                  class="primary--text body-s-semibold"
                >{{ blockTimeFormat }}</span>
                <v-btn
                  v-else
                  text
                  color="primary"
                  :loading="CertOrderUsedCodeAction"
                  @click="sendSMSCode"
                >
                  <v-icon left>
                    $iconify_feather-refresh-ccw
                  </v-icon>Отправить
                  еще раз
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="code.length === 4">
              <v-col>
                <v-btn
                  color="primary"
                  @click="certSetUsed"
                >
                  <v-icon left>
                    $iconify_ion-checkmark-circle-outline
                  </v-icon>
                  Отметить как использованный
                </v-btn>
              </v-col>
            </v-row>
          </BaseDialogFieldBlock>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-row>
            <v-col class="body-l-semibold">
              Данные сертификата
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="body-s-semibold"
              cols="4"
            >
              Название:
            </v-col>
            <v-col>{{ cert.certificate.name }}</v-col>
          </v-row>
          <v-row>
            <v-col
              class="body-s-semibold"
              cols="4"
            >
              № заказа:
            </v-col>
            <v-col>{{ cert.order.num }}</v-col>
          </v-row>
          <v-row>
            <v-col
              class="body-s-semibold"
              cols="4"
            >
              ID сертификата:
            </v-col>
            <v-col>{{ cert.number || cert.id }} </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <certificate-user-block
            v-if="!!cert.user"
            :user="cert.user"
          />
        </v-col>
      </v-row>
    </v-form>
  </BaseDrawerDialog>
</template>

<script>
  import { mapActions } from 'vuex'
  import dialogable from '@/mixins/dialogable.js'

  export default {
    components: {
      CertificateUserBlock: () => import('./CertificateUserBlock'),
    },
    mixins: [dialogable],
    props: {
      cert: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        valid: false,
        code: '',
        CertOrderUsedAction: false,
        CertOrderUsedCodeAction: false,
        block_sec_left: null,

      }
    },
    computed: {
      blockTimeFormat () {
        if (this.block_sec_left > 0) {
          const min = Math.trunc(this.block_sec_left / 60)
          const sec = this.block_sec_left - min * 60
          return min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0')
        } else return ''
      },
    },
    mounted () {
      this.sendSMSCode()
    },
    methods: {
      ...mapActions({
        CertOrderUsedCode: 'account/certificate/certificate/CertOrderUsedCode',
        CertOrderUsed: 'account/certificate/certificate/CertOrderUsed',
      }),

      async SetUsedClick () {
        if (!this.$refs.form.validate()) return
        try {
          this.CertOrderPaidAction = true
          await this.CertOrderPaid({ id: this.cert.id, type: this.paidType, transactionId: this.transactionId, comment: this.comment })
          this.close()
        } catch (error) {
          console.error(error)
        } finally {
          this.CertOrderPaidAction = false
        }
      },

      runSecondLeft (codeBlockSec) {
        this.block_sec_left = codeBlockSec
        var blockInterval = setInterval(() => {
          if (this.block_sec_left > 0) {
            this.block_sec_left--
          } else {
            clearInterval(blockInterval)
          }
        }, 1000)
      },

      async sendSMSCode () {
        try {
          this.CertOrderUsedCodeAction = true
          const result = await this.CertOrderUsedCode(this.cert.id)
          this.$notify({
            title: 'SMS-код отправлен',
            text: `Номер телефона: ${result.phone}\nДействителен ${result.code_life_min} мин.`,
            type: 'success',
          })
          this.runSecondLeft(result.code_block_sec)
        } catch (error) {
          console.error(error)
        } finally {
          this.CertOrderUsedCodeAction = false
        }
      },
      async certSetUsed () {
        if (this.code.length !== 4) return
        try {
          this.CertOrderUsedAction = true
          await this.CertOrderUsed({ id: this.cert.id, useCode: this.code })
          this.close()
        } catch (error) {
          console.error(error)
        } finally {
          this.CertOrderUsedAction = false
        }
      },
    },

  }
</script>

<style lang="scss" scoped>

</style>
