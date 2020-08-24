<template lang="">
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <BaseMasterFieldBlock
          title="Номиналы сертификатов"
        >
          <span slot="description">Внесите до 10 номиналов сертификатов. Придумайте названия номиналов таким образом, чтобы они соответствовали названию сертификата и отображали его суть.</span>
          <template v-slot:input>
            <div>
              <v-row>
                <v-switch
                  v-model="cert.quantity_unlimit"
                  label="Бесконечное количество сертификатов"
                  @change="quantityUnlimitChange"
                />
              </v-row>
              <v-row
                v-for="(item, index) in cert.nominals"
                :key="index"
              >
                <v-col>
                  <v-text-field
                    v-model="item.nominal_name"
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
                    :style="{width: '154px'}"
                    placeholder="Стоимость"
                    suffix="₽"
                    type="number"
                    outlined                    
                  />
                </v-col>
                <v-col :cols="'auto'">
                  <v-text-field
                    v-if="!cert.quantity_unlimit"
                    :value="item.quantity === null ? '∞' : item.quantity"
                    :append-outer-icon="'mdi-plus'"
                    :prepend-icon="'mdi-minus'"
                    :style="{width: '120px', 'text-align': 'center'}"
                    type="number"
                    outlined
                    readonly
                    @click:append-outer="item.quantity = (item.quantity === null? 1 : item.quantity + 1)"
                    @click:prepend="item.quantity = (item.quantity === null? 0 : item.quantity - 1)"
                  />
                </v-col>
                <v-col :cols="'auto'">
                  <v-btn
                    fab
                    x-small
                    color="secondary"
                    @click="onRemoveNominalClick(item, index)"
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
                <v-btn
                  color="secondary"
                  :text="true"
                  :ripple="false"
                  @click="onAppendNominalClick"
                >  <span
                              class="iconify"
                              data-icon="uil:plus-circle"
                              data-inline="false"
                              width="21px"
                              heigth="21px"
                            />
                  Добавить
                </v-btn>
              </v-row>
            </div>
          </template>
        </BaseMasterFieldBlock>

        <v-row>
          <v-col>
            <v-btn
              color="primary"
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
      }
    },
    computed: {

    },
    created () {

    },
    methods: {
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
        const number =  NumberParser('ru-RU').parse( event )
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
        this.$emit('continue', true)
      },
      onAppendNominalClick () {
        this.cert.nominals.push({
          nominal_name: '',
          selling_price: 0,
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
          this.cert.nominals.forEach(item => (item.quantity = 0))
        }
      },
    },
  }
</script>
