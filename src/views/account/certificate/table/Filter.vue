<template>
  <v-row
    no-gutters
  >
    <v-col>
      <div class="app__popover">
        <div
          class="app__popover-block-input"
          style="border: 1px solid #D7D7E0; border-radius: 10px;"
        >
          <v-icon>
            $iconify_search-outlined
          </v-icon>
          <input
            class="app__popover-block-input-field"
            placeholder="Поиск и фильтр"
            @focus="switchShow"
          >
        </div>
        <div
          v-show="show"
          class="app__popover-block"
        >
          <div
            class="app__popover-block-input"
          >
            <v-icon>
              $iconify_search-outlined
            </v-icon>
            <input
              ref="search"
              class="app__popover-block-input-field"
              placeholder="Поиск и фильтр"
            >
            <v-icon
              class="app__popover-block-icon-close"
              @click="close()"
            >
              $iconify_chrome-close
            </v-icon>
            <v-icon
              class="app__popover-block-icon-check"
              @click="apply()"
            >
              $iconify_bx-check
            </v-icon>
          </div>
          <div class="app__popover-content">
            <v-row>
              <v-col>
                <div class="app__popover-content-header">
                  Сертификаты {{ filter }}<br>
                </div>
<!--                <div-->
<!--                  v-for="(item, i) in operations"-->
<!--                  :key="i"-->
<!--                  :class="getFilterClass('pbr', item)"-->
<!--                  @click="setFilter('pbr', item)"-->
<!--                >-->
<!--                  {{ item.title }}-->
<!--                </div>-->
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__popover-content-header">
                  Оплаты
                </div>
                <div
                  v-for="(item, i) in certPaymentStatusEnum"
                  :key="i"
                  :class="getFilterClass('certOrderStatus', item)"
                  @click="setFilter('certOrderStatus', item)"
                >
                    <img :src="paymentStatusIcon(item.id)">
                    <span>
                      {{ item.label }}
                      {{ item.label }}
                    </span>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__popover-content-header">
                  Статусы
                </div>
                <div
                    v-for="(item, i) in certOrderStatusEnum"
                    :key="i"
                    :class="getFilterClass('certOrderStatus', item)"
                    @click="setFilter('certOrderStatus', item)"
                >
                  <img :src="statusIcon(item.id)">
                  {{ item.label }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__popover-content-header">
                  Выплаты
                </div>
                <div
                    v-for="(item, i) in certMerchantOrderStatusEnum"
                    :key="i"
                    :class="getFilterClass('certOrderStatus', item)"
                    @click="setFilter('certOrderStatus', item)"
                >
                  <img :src="merchantOrderStatusIcon(item.id)">
                  {{ item.label }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__popover-content-header">
                  Выпущен
                </div>
                <div>
                  <date-range-picker
                      ref="picker"
                      opens="right"
                      :ranges="false"
                      :auto-apply="false"
                      :locale-data="{
                            firstDay: 0,
                            separator: ' * ',
                            applyLabel: 'Применить',
                            cancelLabel: 'Отменить',
                            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                            daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                          }"
                      v-model="filter.issueDate"
                  >
                    <template #input="picker" style="min-width: 350px;">
                      {{ $moment(picker.startDate).format('DD.MM.YYYY') }} - {{ $moment(picker.endDate).format('DD.MM.YYYY') }}
                    </template>

                    <div slot="footer" slot-scope="data">
                      <div class="footer-content">
                        <div class="range">
                          {{ formatRange(data.rangeText) }}
                        </div>
                        <div class="actions">
                          <v-btn
                              color="primary"
                              small
                              @click="data.clickCancel()"
                          >
                            Отменить
                          </v-btn>
                          <v-btn
                              small
                              color="primary"
                              @click="data.clickApply"
                          >
                                  <span
                                      class="iconify"
                                      data-icon="carbon:checkmark-outline"
                                      data-inline="false"
                                  />
                            Применить
                          </v-btn>
                        </div>
                      </div>
                    </div>

                  </date-range-picker>
                </div>
              </v-col>
              <v-col>
                <div class="app__popover-content-header">
                  Покупатели
                </div>
                <div>
                  <input
                    v-model="filter.buyers"
                    class="app__popover-content-input"
                    placeholder="Начните вводить имя клиента"
                  >
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import DateRangePicker from 'vue2-daterange-picker'
  import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

  const statusStyles = Object.freeze({
    default: {
      border: '2px dashed #808B8D',
      color: '#808B8D',
      // background: "linear-gradient(180deg, #B5B5B5 0%, #7E7E7E 100%)"
    },
    yellow: {
      border: '2px dashed #E29D3A',
      color: '#E29D3A',
      // background: "linear-gradient(180deg, #E09B3D 0%, #B8771E 100%)"
    },
    lightGreen: {
      border: '2px dashed #7DB529',
      color: '#7DB529',
      // background: "linear-gradient(180deg, #7DB529 0%, #5F802E 100%)"
    },
    green: {
      border: '2px dashed #199653',
      color: '#199653',
      // background: "linear-gradient(180deg, #29B572 0%, #117042 100%)"
    },
    red: {
      border: '2px dashed #A31419',
      color: '#A31419',
      // background: "linear-gradient(180deg, #EC1C24 0%, #A31419 100%)"
    },
    blue: {
      border: '2px dashed #07426C',
      color: '#07426C',
      // background: "linear-gradient(180deg, #0D64A1 0%, #07426C 100%)"
    },
    black: {
      border: '2px dashed #4C4E4F',
      color: '#4C4E4F',
      // background: "linear-gradient(180deg, #808B8D 0%, #4C4E4F 100%)"
    },
  })

  export default {
    components: {
      DateRangePicker,
    },
    data () {
      return {
        filter: null,
        show: false,
        certPaymentStatusEnum: [
          {
            id: 'wait',
            label: 'Ожидает оплаты',
          },
          {
            id: 'SBERBANK',
            label: 'Оплачен картой',
          },
          {
            id: 'PLUS_CASH',
            label: 'Оплачен на кассе',
          },
          {
            id: 'PLUS_OTHER',
            label: 'Оплачен другим способом',
          },
        ],
        certMerchantOrderStatusEnum: [
          {
            id: 'succeded',
            label: 'Выплачено',
          },
          {
            id: 'wait',
            label: 'Ожидает',
          },
          {
            id: 'not_paid',
            label: 'Не выплачено',
          },
          {
            id: 'not_required',
            label: 'Не требуется',
          },
        ],
        certOrderStatusEnum: [
          {
            id: 'new',
            label: 'Размещен',
          },
          {
            id: 'wait_payment',
            label: 'Ожидает оплаты',
            short: 'Ожидает оплаты',
            style: statusStyles.default,
          },
          {
            id: 'paid',
            label: 'Оплачен',
            short: 'Оплачен',
            style: statusStyles.red,
          },
          {
            id: 'issued',
            label: 'Выпущен',
            short: 'Выпущен',
            style: statusStyles.yellow,
          },
          {
            id: 'used',
            label: 'Использован',
            short: 'Использован',
            style: statusStyles.lightGreen,
          },
          {
            id: 'deleted',
            label: 'Удален',
            short: 'Удален',
            style: statusStyles.black,
          },
        ],
      }
    },
    computed: {
      filterStore () {
        return this.$store.getters['account/filter/filter']
      },
      filterDefault () {
        return this.$store.getters['account/filter/filterDefault']
      },
    },
    watch: {
      show (v) {
        if (v) {
          // this.filter = Object.assign({}, this.filterStore)
          this.filter = JSON.parse(JSON.stringify(this.filterStore))
        } else {
          this.filter = Object.assign({}, this.filterDefault)
        }
      },
    },
    created () {
      this.filter = this.filterDefault
    },
    methods: {
      statusIcon (status) {
        if (status === 'wait_payment') {
          status = 'wait'
        }
        return require('@/icons/svg/' + status + '.svg')
      },
      merchantOrderStatusIcon (status) {
        return require('@/icons/svg/payments/' + status + '.svg')
      },
      paymentStatusIcon (status) {
        switch (status) {
          case 'SBERBANK':
            status = 'card'
            break
          case 'PLUS_CASH':
            status = 'cashier'
            break
          case 'wait':
            status = 'wait'
            break
          default:
            status = 'another'
        }

        return require('@/icons/svg/' + status + '.svg')
      },
      formatRange (range) {
        const start = range.split(' - ')[0]
        const end = range.split(' - ')[1]
        if (start !== undefined && start !== null && end !== undefined && end !== null) {
          return this.$moment(start).format('ll') + ' - ' + this.$moment(end).format('ll')
        }
        return ' - '
      },
      async switchShow () {
        this.show = !this.show
        await this.$nextTick()
        this.$refs.search.focus()
      },
      getFilterClass (field, item) {
        // const filter = Object.assign({}, this.filter)
        console.log(item)
        if (this.filter && this.filter[field].includes(item.id)) return 'app__popover-content-chip app__popover-content-chip-active'
        return 'app__popover-content-chip'
      },
      setFilter (field, item) {
        // const filter = Object.assign({}, this.filter)
        const index = this.filter[field].indexOf(item.id)
        if (index === -1) {
          this.filter[field].push(item.id)
        } else {
          this.filter[field].splice(index, 1)
        }
      },
      close () {
        this.show = false
      },
      apply () {
        this.$store.commit('account/filter/filter', this.filter)
        this.show = false
      },
    },
  }
</script>

<style lang="sass" scoped>
.app__popover
  position: relative

  .app__popover-block
    position: absolute
    top: 0
    left: 0
    width: 100%
    background: #FFFFFF
    border: 1px solid #E8E8ED
    box-sizing: border-box
    box-shadow: 0px 12px 24px rgba(88, 93, 106, 0.1)
    border-radius: 10px
    z-index: 1000

    .app__popover-content
      padding: 8px 20px

      .app__popover-content-header
        margin-bottom: 12px
        font-style: normal
        font-weight: 600
        font-size: 15px
        line-height: 21px
        letter-spacing: 0.1px
        color: #2A2A34

      .app__popover-content-input
        width: 100%
        outline: none !important
        padding: 11px 12px
        font-style: normal
        font-weight: 500
        font-size: 13px
        line-height: 17px
        color: #9191A1
        border: 1px solid #D7D7E0
        box-sizing: border-box
        border-radius: 10px

      .app__popover-content-chip
        display: inline-block
        margin-right: 8px
        padding: 10px 12px
        font-style: normal
        font-weight: 600
        font-size: 13px
        line-height: 17px
        color: #9191A1
        background: #F2F2F7
        border-radius: 8px
        cursor: pointer

      .app__popover-content-chip-active
        background: #EBF1FF
        color: #4776E6

      .app__popover-content-checkbox
        display: inline-block
        margin-right: 20px
        font-style: normal
        font-weight: 500
        font-size: 15px
        line-height: 21px
        color: #9191A1

        input
          display: inline-block
          margin-right: 11px

        div
          display: inline-block
          position: relative
          top: -1px

.app__popover-block-input
  display: flex
  align-items: center
  padding: 11px 12px
  color: #9191A1
  border-bottom: 1px solid #D7D7E0
  box-sizing: border-box
  border-top-left-radius: 10px
  border-top-right-radius: 10px

  .app__popover-block-input-field
    display: block
    width: 100%
    outline: none !important
    padding: 0 10px
    font-style: normal
    font-weight: 500
    font-size: 13px
    line-height: 17px

.app__popover-block-icon-close
  color: #B5B5C4 !important
  cursor: pointer

.app__popover-block-icon-check
  width: 42px !important
  height: 28px !important
  position: relative
  top: -1px
  margin-left: 5px
  color: #4776E6 !important
  cursor: pointer
</style>
