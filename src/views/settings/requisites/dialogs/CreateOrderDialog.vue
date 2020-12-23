<template>
  <BaseDrawerDialog
    v-model="dialog"
    title="Новый счет на оплату"
  >
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row>
        <v-col>
          <BaseDialogFieldBlock
            title="Сумма счета"
            description="Минимальный платеж при выставлении счета - 5 000 ₽. Если вам нужно оплатить меньшую сумму - используйте моментальные способы оплаты."
          >
            <base-text-field
              v-model.number="valueRub"
              :rules="valueRules"
              :validation-placement="'top'"
              :key-filter-regexp="/(\d|Delete|Backspace|Enter|Tab)/"
              maxlength="7"
              placeholder="Введите сумму"
            />
          </BaseDialogFieldBlock>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <BaseDialogFieldBlock
            title="Описание"
            description="Введите описание счета. Нужно описать для чего это нужно и в каких случаях этого можно не делать."
          >
            <v-textarea
              v-model="description"
              :rules="commentRules"
              :rows="3"
              auto-grow
              placeholder="Описание счета"
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
            :loading="CreateOrderAction"
            @click="onSubmit()"
          >
            <v-icon left>
              $iconify_ion-checkmark-circle-outline
            </v-icon><span>Создать счет</span>
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
    props: {
    },
    constants: {
    },
    data () {
      return {
        valid: false,
        CreateOrderAction: false,
        valueRub: null,
        description: null,
        valueRules: [
          (v) => isFilled(v) || 'Введите сумму',
          (v) => isNumeric(v) || 'Должно быть числом',
          (v) => isPosNumber(v) || 'Должно быть положительным',
          (v) => v <= this.$config.MAX_TRAN_VALUE || `Не более ${this.$config.MAX_TRAN_VALUE}`,
        ],
        commentRules: [
          v => String(v).length <= 255 || 'Не более 255 символов',
        ],

      }
    },
    computed: {
      valueCoin () { return Math.round(this.valueRub * 100) },
    },
    mounted () {

    },
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
            method: MERCHANT_ORDER_METHOD.METHOD_ORDER_ORG,
            description: this.description,
          })
          this.close(newOrder)
        } catch (error) {
          console.error(error)
        } finally {
          this.CreateOrderAction = false
        }
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
