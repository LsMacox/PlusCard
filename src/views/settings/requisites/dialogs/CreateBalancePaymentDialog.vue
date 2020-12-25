<template>
  <BaseDrawerDialog
    v-model="dialog"
    class="balance-payment-dialog"
    title="Пополнение счета"
  >
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row>
        <v-col>
          <BaseDialogFieldBlock
            title="Сумма"
            description="Введите любую сумму для пополнения и выберите способ оплаты. Деньги сразу же зачислятся на ваш счет."
          >
            <base-text-field
              v-model.number="valueRub"
              :rules="valueRules"
              :validation-placement="'top'"
              :key-filter-regexp="/(\d|\.|Delete|Backspace|Enter|Tab)/"
              maxlength="7"
              placeholder="Введите сумму"
            />
          </BaseDialogFieldBlock>
        </v-col>
      </v-row>
      <v-row justify="space-around">
        <v-col cols="auto">
          <v-btn
            :class="{
              'bank-payments': true,
              'payment-method-btn': true,
              'payment-method-btn--selected':
                method === MERCHANT_ORDER_METHOD.METHOD_SBERBANK,
            }"
            :color="
              method === MERCHANT_ORDER_METHOD.METHOD_SBERBANK
                ? 'secondary'
                : 'neutral-100'
            "
            @click="setPayMethod(MERCHANT_ORDER_METHOD.METHOD_SBERBANK)"
          >
            <v-icon class="">
              $icons_payment-mastercard
            </v-icon>
            <span class="body-m-semibold neutral-600--text">/</span>
            <v-icon class="">
              $icons_payment-visa
            </v-icon>
            <span class="body-m-semibold neutral-600--text">/</span>
            <v-icon class="">
              $icons_payment-mir
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            :class="{
              'payment-method-btn': true,
              'payment-method-btn--selected':
                method === MERCHANT_ORDER_METHOD.METHOD_ORDER_ORG,
            }"
            :color="
              method === MERCHANT_ORDER_METHOD.METHOD_ORDER_ORG
                ? 'secondary'
                : 'neutral-100'
            "
            @click="setPayMethod(MERCHANT_ORDER_METHOD.METHOD_ORDER_ORG)"
          >
            <div style="margin-left: -4px; margin-right: 8px">
              <v-icon> $icons_file-invoice </v-icon>
            </div>

            <span style="color: #2a2a34">Счет на оплату</span>
          </v-btn>
        </v-col>
      </v-row>

      <v-row><v-col /></v-row>

      <v-row>
        <v-col>
          <v-btn
            color="primary"
            :disabled="!valid || CreateOrderAction"
            :loading="CreateOrderAction"
            @click="onSubmit()"
          >
            <v-icon left>
              $iconify_ion-checkmark-circle-outline
            </v-icon><span>Пополнить</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </BaseDrawerDialog>
</template>

<script>
  import { mapActions } from 'vuex'
  import dialogable from '@/mixins/dialogable.js'
  import { isFilled, isNumeric, isPosNumber } from '@/utils/validate'
  import { MERCHANT_ORDER_METHOD } from '@/models/enums'

  export default {
    components: {},
    mixins: [dialogable],
    props: {},
    constants: {
      MERCHANT_ORDER_METHOD,
    },
    data () {
      return {
        valid: false,
        CreateOrderAction: false,
        valueRub: null,
        method: MERCHANT_ORDER_METHOD.METHOD_SBERBANK,
        description: null,
        valueRules: [
          (v) => isFilled(v) || 'Введите сумму',
          (v) => isNumeric(v) || 'Должно быть числом',
          (v) => isPosNumber(v) || 'Должно быть положительным',
          (v) =>
            v <= this.$config.MAX_TRAN_VALUE ||
            `Не более ${this.$config.MAX_TRAN_VALUE}`,
        ],
        commentRules: [(v) => String(v).length <= 255 || 'Не более 255 символов'],
      }
    },
    computed: {
      valueCoin () {
        return Math.round(this.valueRub * 100)
      },
    },
    mounted () {},
    methods: {
      ...mapActions({
        CreateOrder: 'auth/merchant/CreateOrder',
      }),
      async onSubmit () {
        if (!this.$refs.form.validate()) return
        try {
          this.CreateOrderAction = true
          const newOrder = await this.CreateOrder({
            value: this.valueCoin,
            method: this.method,
            description: this.description,
          })
          this.close(newOrder)
        } catch (error) {
          console.error(error)
        } finally {
          this.CreateOrderAction = false
        }
      },
      setPayMethod (method) {
        this.method = method
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.balance-payment-dialog {
  .payment-method-btn {
    background-color: $neutral-100;
    color: $neutral-900 !important;
    border: 1px solid $neutral-100 !important;

    &.payment-method-btn--selected {
      background-color: $primary-100;
      border: 1px solid $primary-base !important;
    }

    &.bank-payments {
      svg,
      span {
        margin-left: 6px;
        margin-right: 6px;
      }
    }
  }
}

.dialog-header {
  padding: 34px;
}
.dialog-body {
  padding: 34px;
  padding-right: 34px;
}
.cert-payment-select {
  margin-top: 14px;
  margin-bottom: 14px;
}
</style>
