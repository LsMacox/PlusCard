<template>
  <BaseDrawerDialog
    v-model="dialog"
    title="Продление сертификата"
  >
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row>
        <v-col>
          <BaseDialogFieldBlock
            title="Срок действия"
            description="Введите новую дату окночтания срока действия сертификата"
          >
            <v-row align="center">
              <v-col cols="auto">
                <base-date-text-field
                  :date.sync="newExpiresAt"
                  :date-format="dateFormat"
                  class="date-start"
                  style="width:180px"
                  placeholder="дд.мм.гггг"
                  :rules="newExpiresAtRules"
                  validation-placement="bottom"
                  left
                />
              </v-col>
              <v-col>
                <v-btn
                  v-show="valid"
                  color="primary"
                  :loading="certOrderContinueAction"
                  @click="continueCertClick"
                >
                  <v-icon left>
                    $iconify_ion-checkmark-circle-outline
                  </v-icon>
                  Продлить сертификат
                </v-btn>
              </v-col>
            </v-row>
          </BaseDialogFieldBlock>
        </v-col>
      </v-row>
      <certificate-info-row :cert="cert" />
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
  import { config } from '@/config'

  export default {
    components: {
      CertificateUserBlock: () => import('./CertificateUserBlock'),
      CertificateInfoRow: () => import('./CertificateInfoRow'),
    },
    mixins: [dialogable],
    props: {
      cert: {
        type: Object,
        required: true,
      },
    },
    constants: {
      dateFormat: config.date.DATE_FORMAT,
    },
    data () {
      return {
        valid: false,
        newExpiresAt: '',
        certOrderContinueAction: false,
        newExpiresAtRules: [
          (v) => !!v || 'Введите новую дату истечения',
          (v) => (!!v && this.$moment(v, this.dateFormat).diff(this.$moment.now(), 'days') >= 0) || 'Новая дата должна быть больше текущей',
        ],

      }
    },
    computed: {

    },
    mounted () {

    },
    methods: {
      ...mapActions({
        certOrderContinue: 'account/certificate/certificate/Continue',
      }),

      async continueCertClick () {
        if (!this.$refs.form.validate()) return

        try {
          this.certOrderContinueAction = true
          await this.certOrderContinue({
            id: this.cert.id,
            expiresAt: this.$moment(this.newExpiresAt).set({
              hour: 23,
              minute: 59,
              second: 59,
              millisecond: 0,
            }),
          })
          this.close()
        } catch (error) {
          console.error(error)
        } finally {
          this.certOrderContinueAction = false
        }
      },

    },

  }
</script>

<style lang="scss" scoped>

</style>
