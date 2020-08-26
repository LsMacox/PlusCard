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
                    label="Бесконечное количество сертификатов"
                    @change="quantityUnlimitChange"
                  />
                </v-col>
              </v-row>
              <v-row
                v-for="(item, index) in cert.nominals"
                :key="index"
              >
                <v-col>
                  <v-text-field
                    v-model="item.nominal_name"
                    :rules="nominalNameRules"
                    placeholder="Введите название номинала"
                    counter="20"
                    maxlength="20"
                    outlined
                  />
                </v-col>
                <v-col :cols="'auto'">
                  <!--  :value="formatSellingPrice(item.selling_price)" -->
                  <v-text-field
                    v-model.number="item.selling_price"
                    :rules="sellingPriceRules"
                    :style="{width: '154px'}"
                    placeholder="Стоимость"
                    class="text-align-right"
                    suffix="₽"
                    type="number"
                    @blur="item.selling_price = Math.min(Math.max(item.selling_price, 0), MAX_PRICE)"
                    outlined
                  />
                </v-col>
                <v-col :cols="'auto'">
                  <v-text-field
                    v-if="!cert.quantity_unlimit"
                    v-model.number="item.quantity"
                    :style="{width: '154px'}"
                    class="text-align-center"
                    placeholder="∞"
                    type="number"
                    outlined
                    @blur="item.quantity = Math.min(Math.max(item.quantity, 0), MAX_QUANTITY)"                    
                  >
                    <template v-slot:prepend>
                      <v-icon
                        color="primary"
                        @click="item.quantity = (item.quantity > 0 ? item.quantity - 1 : 0)"
                      >
                        mdi-minus
                      </v-icon>
                    </template>
                    <template v-slot:append-outer>
                      <v-icon
                        color="primary"
                        @click="item.quantity = (item.quantity === null? 1 : item.quantity + 1)"
                      >
                        mdi-plus
                      </v-icon>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col :cols="'auto'">
                  <v-btn
                    v-if="cert.nominals.length>1"
                    fab
                    x-small
                    color="secondary"
                    :style="{'margin-top': '12px'}"
                    @click="onRemoveNominalClick(item, index)"
                  >
                    <span
                      class="iconify trash_icon"
                      data-icon="feather:trash"
                      data-inline="false"
                    />
                  </v-btn>
                  <v-btn
                    v-else
                    :disabled="isEmptyNominal(cert.nominals[0])"
                    fab
                    x-small
                    color="secondary"
                    :style="{'margin-top': '12px'}"
                    @click="onClearNominalClick(item, index)"
                  >
                    <span
                      class="iconify trash_icon"
                      data-icon="feather:trash"
                      data-inline="false"
                    />
                  </v-btn>
                </v-col>
                <!-- <v-col v-if="!cert.quantity_unlimit">

                </v-col>
                <v-col>

                </v-col> -->
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
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

        <v-row>
          <v-col>
            <v-btn
              :disabled="!valid"
              color="primary"
              class="master-next-btn"
              @click="onEndClick"
            >
              Создать сертификат
              <v-icon right>
                mdi-arrow-right
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
  import NumberParser from '@/utils/NumberParser.js'

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
        valid: false,
        nominalNameRules: [
          (v) => !!v || 'Введите название номинала',
        ],
        sellingPriceRules: [
          (v) => (!!v && v>0) || 'Введите стоимость',
        ],
      }
    },
    computed: {

    },
    created () {
      this.MAX_QUANTITY = MAX_QUANTITY
      this.MAX_PRICE = MAX_PRICE
    },
    methods: {
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
        if (number != NaN) {
          item.selling_price = number
        } else {
          item.selling_price = null
        }
      },
      formatSellingPrice (selling_price) {
        console.log('formatSellingPrice', selling_price)
        return selling_price ? selling_price.toLocaleString('ru-RU', {
          style: 'decimal',
          currency: 'RUB',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }) : ''
      },
      onEndClick () {
        if (this.$refs.form.validate()) {
          this.$emit('continue', true)
        }
      },
      onAppendNominalClick () {
        this.cert.nominals.push({
          nominal_name: '',
          selling_price: null,
          quantity: null,
        })
      },
      onRemoveNominalClick (nominal, index) {
        this.cert.nominals.splice(index, 1)
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
    },
  }
</script>
<style lang="scss" scoped>
@import 'master-style.scss';
</style>
