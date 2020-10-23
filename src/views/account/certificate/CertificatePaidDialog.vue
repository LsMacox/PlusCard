<template>
  <v-navigation-drawer
    v-model="dialog"
    class="cert-details"
    fixed
    right
    temporary
    width="500"
  >
    <v-row
      no-gutters
      class="dialog-header"
    >
      <v-btn
        text
        color="primary"
        @click="close()"
      >
        <v-icon>$iconify_arrow-left</v-icon>  Назад
      </v-btn>
    </v-row>
    <v-container class="dialog-body">
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-row>
          <v-col class="title-m-bold">
            Оплата сертификата
          </v-col>
        </v-row>
        <v-row>
          <v-col class="body-l-semibold primary--text">
            {{ cert.order.num }}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="">
            <v-radio-group
              v-model="paidType"
              class="cert-payment-select"
              hide-details
              row
              @change="onPaidTypeChange"
            >
              <v-radio
                v-for="item in CERT_PAYMENT_TYPE_ENUM"
                :key="item.id"
                :label="item.text"
                :value="item.id"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <BaseDialogFieldBlock
              v-if="paidType === CERT_PAYMENT_TYPE_ENUM.PLUS_CASH.id"
              title="Данные чека"
              description="Введие номер чека оплаты сертификата в поле ниже."
            >
              <base-text-field
                v-model="transactionId"
                :rules="transRules"
                placeholder="Введите номер чека"
                error-style="vuetify"
                maxlength="255"
              />
            </BaseDialogFieldBlock>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <BaseDialogFieldBlock

              title="Коментарий"
              description="Введие номер чека оплаты сертификата в поле ниже."
            >
              <v-textarea
                v-model="comment"
                :rules="commentRules"
                :rows="3"
                auto-grow
                placeholder="Введите комментарий"
                outlined
                maxlength="255"
              />
            </BaseDialogFieldBlock>
          </v-col>
        </v-row>

        <v-row v-show="valid">
          <v-col>
            <v-btn
              color="primary"
              :loading="CertOrderPaidAction"
              @click="MakePaidClick()"
            >
              <v-icon left>
                $iconify_ion-checkmark-circle-outline
              </v-icon>Оплатить сертификат
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
  import { mapActions } from 'vuex'
  import dialogable from '@/mixins/dialogable.js'
  import { CERT_PAYMENT_TYPE_ENUM } from '@/models/enums'

  export default {
    components: {},
    mixins: [dialogable],
    props: {
      cert: {
        type: Object,
        required: true,
      },
    },
    constants: {
      CERT_PAYMENT_TYPE_ENUM,
    },
    data () {
      return {
        valid: false,
        CertOrderPaidAction: false,
        paidType: CERT_PAYMENT_TYPE_ENUM.PLUS_CASH.id,
        comment: null,
        transactionId: null,
        transRules: [
          v => !!v || 'Введите данные чека оплаты',
          v => String(v).length <= 255 || 'Не более 255 символов',
        ],
        commentRules: [
          v => String(v).length <= 255 || 'Не более 255 символов',
        ],

      }
    },
    computed: {},
    mounted () {

    },
    methods: {
      ...mapActions({
        CertOrderPaid: 'account/certificate/certificate/CertOrderPaid',
      }),
      async MakePaidClick () {
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
      onPaidTypeChange (v) {
        if (v !== CERT_PAYMENT_TYPE_ENUM.PLUS_CASH.id) this.transactionId = null
      },
    },
  }
</script>

<style lang="scss" scoped>
.dialog-header{
  padding: 34px;
}
.dialog-body {
  padding: 34px;
  padding-right: 34px;
}
.cert-payment-select {
  margin-top: 14px;;
  margin-bottom: 14px;
}
</style>
