<template lang="">
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-form
        ref="form"
        v-model="valid"
      >
        <BaseMasterFieldBlock
          title="Номиналы сертификатов"
        >
          <span slot="description">Внесите до 10 номиналов сертификатов. Придумайте названия номиналов таким образом, чтобы они соответствовали названию сертификата и отображали его суть.</span>
          <template v-slot:input>
            <div>
              <v-row>
                <v-col>
                  <v-switch
                    v-model="cert.quantity_unlimit"
                    :disabled="true"
                    label="Бесконечное количество сертификатов"
                    @change="quantityUnlimitChange"
                  />
                </v-col>
              </v-row>
              <v-row
                v-for="(item, index) in cert.nominals"
                :key="index"
                align="baseline"
              >
                <v-col>
                  <base-text-field
                    v-model="item.nominal_name"
                    :disabled="!!item.id"
                    :rules="nominalNameRules"
                    validation-placement="top"
                    placeholder="Введите название номинала"
                    counter="40"
                    maxlength="40"
                    outlined
                    @keydown.enter="$refs['sellPriceInput'+index] && $refs['sellPriceInput'+index][0].focus()"
                  />
                </v-col>
                <v-col :cols="'auto'">
                  <!--  :value="formatSellingPrice(item.selling_price)" -->
                  <base-text-field
                    :ref="'sellPriceInput'+index"
                    v-model.number="item.selling_price"
                    :disabled="!!item.id"
                    :rules="sellingPriceRules"
                    :style="{width: '154px'}"
                    validation-placement="top"
                    placeholder="Стоимость"
                    class="text-align-right"
                    suffix="₽"
                    outlined
                    maxlength="7"
                    :key-filter-regexp="/(\d|Delete|Backspace|Enter|Tab)/"

                    @blur="item.selling_price = Math.min(Math.max(item.selling_price, 0), MAX_PRICE)"
                  />
                </v-col>
                <v-col :cols="'auto'">
                  <v-row no-gutters>
                    <v-btn
                      v-if="!cert.quantity_unlimit"
                      :disabled="!!item.id"
                      small
                      icon
                      color="primary"
                      @click="item.quantity = (item.quantity > 0 ? item.quantity - 1 : 0)"
                    >
                      <v-icon>
                        mdi-minus
                      </v-icon>
                    </v-btn>

                    <base-text-field
                      v-if="!cert.quantity_unlimit"
                      v-model.number="item.quantity"
                      :disabled="!!item.id"
                      :rules="quantityRules"
                      :style="{width: '72px'}"
                      class="text-align-center"
                      placeholder="∞"
                      validation-placement="top"
                      maxlength="7"
                      outlined
                      :key-filter-regexp="/(\d|Delete|Backspace|Enter)/"
                      @blur="item.quantity = Math.min(Math.max(item.quantity, 0), MAX_QUANTITY)"
                    />
                    <v-btn
                      v-if="!cert.quantity_unlimit"
                      :disabled="!!item.id"
                      small
                      icon
                      color="primary"
                      @click="item.quantity = (item.quantity === null? 1 : item.quantity + 1)"
                    >
                      <v-icon>
                        mdi-plus
                      </v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
                <v-col :cols="'auto'">
                  <v-row no-gutters>
                    <v-btn
                      v-if="cert.nominals.length>1"
                      fab
                      x-small
                      color="secondary"
                      @click="onRemoveNominalClick(item, index)"
                    >
                      <v-icon>$iconify_feather-trash</v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      :disabled="isEmptyNominal(cert.nominals[0]) || !!cert.nominals[0].id"
                      fab
                      x-small
                      color="secondary"
                      @click="onClearNominalClick(item, index)"
                    >
                      <v-icon>$iconify_feather-trash</v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
                <!-- <v-col v-if="!cert.quantity_unlimit">

                </v-col>
                <v-col>

                </v-col> -->
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    v-show="cert.nominals.length<10"
                    color="secondary"
                    :text="true"
                    :ripple="false"
                    @click="onAppendNominalClick"
                  >
                    <span
                      class="iconify"
                      data-icon="uil:plus-circle"
                      data-inline="false"
                      width="21px"
                      heigth="21px"
                    />
                    Добавить
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </template>
        </BaseMasterFieldBlock>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
  import NumberParser from '@/utils/NumberParser.js'
  import { mapGetters } from 'vuex'

  const MIN_QUANTITY = 0
  const MAX_QUANTITY = 1000000
  const MAX_PRICE = 1000000

  export default {
    model: {
      prop: 'cert',
      event: 'change',
    },
    props: {
      cert: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        deleteNominalAction: false,
        createCertificateLoading: false,
        valid: false,
        nominalNameRules: [
          (v) => !!v || 'Введите название номинала',
          (v) => (!!v && v.length <= 40) || 'Название не должно превышать 40 символов',
        ],
        sellingPriceRules: [
          (v) => (!!v && v > 0) || 'Введите стоимость',
          (v) => (v <= MAX_PRICE) || `Не более ${MAX_PRICE}`,
        ],
        quantityRules: [
          (v) => (v === null || v === '' || +v > 0) || 'Введите',
          (v) => (v <= MAX_QUANTITY) || `Не более ${MAX_QUANTITY}`,
        ],
      }
    },
    computed: {
      ...mapGetters('company/program', ['program']),
    },
    created () {
      this.MAX_QUANTITY = MAX_QUANTITY
      this.MAX_PRICE = MAX_PRICE
      // map nominals
      // if (this.cert && this.cert.nominals){
      //   for (let index = 0; index < this.cert.nominals.length; index++) {
      //       Vue.set(this.cert.nominals[index], 'removeAction', false)
      //     }
      // }
    },
    methods: {
      validate () {
        return this.$refs.form.validate()
      },
      onBlurQuantity (item) {
        if (item.quantity < MIN_QUANTITY) {
          item.quantity = MIN_QUANTITY
        } else if (item.quantity > MAX_QUANTITY) {
          item.quantity = MAX_QUANTITY
        }
      },
      isEmptyNominal (nominal) {
        return !(nominal.nominal_name || nominal.selling_price || nominal.quantity)
      },
      onClearNominalClick (item, index) {
        this.cert.nominals[index].nominal_name = ''
        this.cert.nominals[index].selling_price = null
        this.cert.nominals[index].quantity = null
      },
      keydownSellingPrice (item, event) {
        console.log('keydownSellingPrice', event.key)
        if (/\d/.test(event.key)) {
          return true
        } else {
          event.preventDefault()
        }
      },
      inputSellingPrice (item, event) {
        console.log(item, event)
        const number = NumberParser('ru-RU').parse(event)
        console.log('number', number)
        if (!isNaN(number)) {
          item.selling_price = number
        } else {
          item.selling_price = null
        }
      },
      formatSellingPrice (sellingPrice) {
        console.log('formatSellingPrice', sellingPrice)
        return sellingPrice ? sellingPrice.toLocaleString('ru-RU', {
          style: 'decimal',
          currency: 'RUB',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }) : ''
      },
      onEndClick () {
        if (this.$refs.form.validate()) {
          this.createCert()
        }
      },
      onAppendNominalClick () {
        this.cert.nominals.push({
          nominal_name: '',
          selling_price: null,
          quantity: null,
        })
      },

      async onRemoveNominalClick (nominal, index) {
        try {
          if (nominal.id) {
            await this.$store.dispatch('certificates/certificate/DeleteCertificateNominalDialog', { nominal })
          }
          this.cert.nominals.splice(index, 1)
        } catch (e) {
          console.error(e)
        }
      },

      quantityUnlimitChange () {
        if (this.cert.quantity_unlimit) {
          this.cert.quantity = null
          this.cert.nominals.forEach(item => (item.quantity = null))
        } else {
          this.cert.quantity = 0
          // this.cert.nominals.forEach(item => (item.quantity = 0))
        }
      },

      createCert () {
        const postData = {
          program_id: this.program.id,
          name: this.cert.name,
          short_description: this.cert.short_description,
          description: this.cert.description,
          nominals: this.cert.nominals,
          tags: this.cert.tags,
          activation_rules: this.cert.activation_rules,
          terms_of_use: this.cert.terms_of_use,
          certificate_usage_type: this.cert.certificate_usage_type,
          guaranteed_period: this.cert.guaranteed_period_unlimit
            ? null
            : this.cert.guaranteed_period,
          quantity: this.cert.quantity_unlimit ? null : this.cert.quantity,
          category_id_list: this.cert.category_id_list,
          allow_digital_use: true,
        }
        this.createCertificateLoading = true
        this.$store
          .dispatch('certificates/certificate/CreateCertificate', postData)
          .then(() => {
            this.$emit('continue', true)
          })
          .finally(() => {
            this.createCertificateLoading = false
          })
      // console.log(this.cert)
      },
    },
  }
</script>
<style lang="scss" scoped>
@import 'master-style.scss';
</style>
