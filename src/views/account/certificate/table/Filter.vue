<template>
  <div>
    <v-col style="margin-top: 24px; margin-left: -10px!important">
      <div class="app__filter">
        <div
          class="app__filter-block-input"
          style="border: 1px solid #D7D7E0; border-radius: 10px;"
        >
          <v-icon
            v-show="emptyFastFilter"
            class="app__filter-block-input-icon-prepend"
          >
            $iconify_search-outlined
          </v-icon>

          <div style="width: 100%;">
            <div
              v-for="(item, i) in fastFilter.certificates"
              :key="`certificates${i}`"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ item.label }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click="clearItemFastFilter('certificates', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <div
              v-for="(item, i) in fastFilter.certPaymentStatus"
              :key="`certPaymentStatus${i}`"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ item.label }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click="clearItemFastFilter('certPaymentStatus', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <div
              v-for="(item, i) in fastFilter.certOrderStatus"
              :key="`certOrderStatus${i}`"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ item.label }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click="clearItemFastFilter('certOrderStatus', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <div
              v-for="(item, i) in fastFilter.certMerchantOrderStatus"
              :key="`certMerchantOrderStatus${i}`"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ item.label }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click="clearItemFastFilter('certMerchantOrderStatus', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <div
              v-for="(item, i) in fastFilter.buyers"
              :key="`buyers${i}`"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ item.label }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click="clearItemFastFilter('buyers', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <!--            <div-->
            <!--              v-if="fastFilter.issueDate.id && fastFilter.issueDate.label"-->
            <!--              class="app__filter-chip"-->
            <!--            >-->
            <!--              <div class="app__filter-chip-content">-->
            <!--                {{ fastFilter.issueDate.label }}-->
            <!--                <v-icon-->
            <!--                  class="app__filter-chip-icon-append"-->
            <!--                  @click="clearItemFastFilter('issueDate', { startDate: null, endDate: null })"-->
            <!--                >-->
            <!--                  $iconify_jam-close-->
            <!--                </v-icon>-->
            <!--              </div>-->
            <!--            </div>-->

            <!--поле ввода-->
            <input
              class="app__filter-block-input-field"
              placeholder="Поиск и фильтр"
              @focus="switchShow"
            >
          </div>

          <v-icon
            v-show="!emptyFastFilter"
            class="app__filter-block-input-icon-append"
            @click="clearFastFilter"
          >
            $iconify_chrome-close
          </v-icon>
        </div>

        <!--окно фильтра-->
        <div
          v-show="show"
          class="app__filter-block"
        >
          <div
            class="app__filter-block-input"
          >
            <v-icon
              class="app__filter-block-input-icon-prepend"
            >
              $iconify_search-outlined
            </v-icon>
            <input
              ref="search"
              class="app__filter-block-input-field"
              placeholder="Поиск и фильтр"
            >

            <div class="app__spacer" />

            <v-icon
              class="app__filter-block-input-icon-append app__filter-block-icon-close"
              @click="close()"
            >
              $iconify_chrome-close
            </v-icon>
            <v-icon
              class="app__filter-block-input-icon-append app__filter-block-icon-check"
              @click="apply()"
            >
              $iconify_bx-check
            </v-icon>
          </div>
          <div class="app__filter-content">
            <v-row>
              <v-col>
                <div class="app__filter-content-header">
                  Сертификаты
                  <v-menu
                    v-model="chevronUp"
                    class="certificate-toolbar-select"
                    :rounded="false"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        text
                        color="primary"
                        dark
                        v-bind="attrs"
                        class="archive-status-btn"
                        v-on="on"
                      >
                        {{ archiveStatus.text }}
                        <v-icon class="archive-status-chevron">
                          {{ !chevronUp ? 'fas fa-chevron-down' : 'fas fa-chevron-up' }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in archiveStatuses"
                        :key="index"
                        class="archive-status-menu-item"
                        @click="archiveStatusHandler(item)"
                      >
                        <v-list-item-title>
                          {{ item.text }}
                          <div
                            v-if="archiveStatus.id === item.id"
                            class="archive-status-check-icon"
                          >
                            <span
                              class="iconify"
                              data-icon="bx:bx-check"
                              data-inline="false"
                            />
                          </div>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <br>
                </div>
                <div
                  v-for="(item, i) in programCertificates"
                  v-if="totalCount > 0"
                  :key="i"
                  :class="getFilterClass('certificates', item)"
                  @click="setFilter('certificates', item)"
                >
                  {{ item.name }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__filter-content-header">
                  Оплаты
                </div>
                <div
                  v-for="(item, i) in certPaymentStatusEnum"
                  v-if="totalCount > 0"
                  :key="i"
                  :class="getFilterClass('certPaymentStatus', item)"
                  @click="setFilter('certPaymentStatus', item)"
                >
                  <div>
                    <div class="app__filter-content-chip-icon">
                      <img :src="paymentStatusIcon(item.id)">
                      <span>
                        {{ item.label }}
                      </span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__filter-content-header">
                  Статусы
                </div>
                <div
                  v-for="(item, i) in certOrderStatusEnum"
                  v-if="totalCount > 0"
                  :key="i"
                  :class="getFilterClass('certOrderStatus', item)"
                  @click="setFilter('certOrderStatus', item)"
                >
                  <div class="app__filter-content-chip-icon">
                    <img :src="statusIcon(item.id)">
                    <span>
                      {{ item.label }}
                    </span>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__filter-content-header">
                  Выплаты
                </div>
                <div
                  v-for="(item, i) in certMerchantOrderStatusEnum"
                  v-if="totalCount > 0"
                  :key="i"
                  :class="getFilterClass('certMerchantOrderStatus', item)"
                  @click="setFilter('certMerchantOrderStatus', item)"
                >
                  <div class="app__filter-content-chip-icon">
                    <img :src="merchantOrderStatusIcon(item.id)">
                    <span>
                      {{ item.label }}
                    </span>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="app__filter-content-header">
                  Покупатели
                </div>
                <div>
                  <v-autocomplete
                    v-model="filter.buyers"
                    :items="buyers"
                    placeholder="Начните вводить имя клиента"
                    item-text="userName"
                    item-value="id"
                    outlined
                    multiple
                    chips
                    deletable-chips
                  />
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </v-col>
  </div>
</template>

<script>
  import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

  export default {
    components: {
    },
    data () {
      return {
        chevronUp: false,
        // filter: null,
        archiveStatuses: [
          { id: 'work', text: 'в работе' },
          { id: 'archive', text: 'в архиве' },
        ],
        filter: null,
        fastFilter: {},
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
          },
          {
            id: 'paid',
            label: 'Оплачен',
          },
          {
            id: 'issued',
            label: 'Выпущен',
          },
          {
            id: 'used',
            label: 'Использован',
          },
          {
            id: 'deleted',
            label: 'Удален',
          },
        ],
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      filterStore () {
        return this.$store.getters['account/certificate/filter/filter']
      },
      filterDefault () {
        return this.$store.getters['account/certificate/filter/filterDefault']
      },
      buyers () {
        return this.$store.getters['account/certificate/buyers/buyers']
      },
      programCertificates () {
        return this.$store.getters['account/certificate/certificate/programCertificates']
      },
      archiveStatus: {
        get () {
          return this.$store.getters['account/certificate/filter/archiveStatus']
        },
        set (v) {
          this.$store.commit('account/certificate/filter/archiveStatus', v)
        },
      },
      emptyFastFilter () {
        if (this.fastFilter.certPaymentStatus.length ||
          this.fastFilter.certOrderStatus.length ||
          this.fastFilter.certMerchantOrderStatus.length ||
          this.fastFilter.buyers.length ||
          this.fastFilter.certificates.length ||
          this.fastFilter.archiveStatus
        // (this.fastFilter.issueDate.startDate && this.fastFilter.issueDate.endDate)
        ) {
          return false
        }
        return true
      },
      totalCount () {
        return this.$store.getters['account/certificate/certificate/totalCount']
      },
    },
    watch: {
      show (v) {
        if (v) {
          this.filter = JSON.parse(JSON.stringify(this.filterStore))
        } else {
          this.filter = Object.assign({}, this.filterDefault)
        }
      },
      searchClient (v) {
        v && v !== this.filter.client && this.querySearchClient(v)
      },
      program (v) {
        this.filter = JSON.parse(JSON.stringify(this.filterStore))
        this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
        this.setFastFilter(this.filter)
      },
    },
    destroyed () {
      document.removeEventListener('click', this.clickOutside)
    },
    created () {
      this.filter = JSON.parse(JSON.stringify(this.filterStore))
      this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
      document.addEventListener('click', this.clickOutside)

      this.$store.dispatch('account/certificate/certificate/programCertificates', this.program.id)
      this.$store.dispatch('account/certificate/buyers/buyers', this.program.id)
    },
    methods: {
      clickOutside () {
        // if (this.show) {
        //   this.close()
        // }
      },
      archiveStatusHandler (item) {
        this.chevronUp = !this.chevronUp
        this.$store.commit('account/certificate/filter/archiveStatus', item)
      },
      statusIcon (status) {
        if (status === 'wait_payment') {
          status = 'wait'
        }
        return require('@/icons/svg/' + status + '.svg')
      },
      merchantOrderStatusIcon (status) {
        console.log('ICON: ' + status)
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
      // issueDateRange (startDate, endDate) {
      //   let dateRange = ''
      //   if (startDate === null || endDate === null) {
      //     dateRange = 'Выберите период выпуска сертификата'
      //   } else {
      //     dateRange = this.$moment(startDate).format('DD.MM.YYYY') + ' - ' + this.$moment(endDate).format('DD.MM.YYYY')
      //   }
      //   return dateRange
      // },
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
        console.log('FIELD get...')
        console.log(field)
        console.log(item)
        console.log('FIELD get...')

        if (this.filter && this.filter[field].includes(item.id)) {
          return 'app__filter-content-chip app__filter-content-chip-active'
        }
        return 'app__filter-content-chip'
      },
      setFilter (field, item) {
        console.log('FIELD...')
        console.log(field)
        console.log(item)
        console.log('FIELD...')

        const index = this.filter[field].indexOf(item.id)
        if (index === -1) {
          this.filter[field].push(item.id)
        } else {
          this.filter[field].splice(index, 1)
          // this.clearItemFastFilter(field, item)
        }
      },
      setFastFilter (filter) {
        console.log('FAST__FILTER')
        console.log(filter)
        console.log('FAST__FILTER')
        // filter.archiveStatus.forEach(item => {
        //   const archiveStatus = this.programCertificates.find(objItem => objItem.id === item)
        //   if (archiveStatus) {
        //     const obj = { id: item, label: `Архивный статус: ${archiveStatus.text}` }
        //     if (!this.fastFilter.archiveStatus.find(objItem => objItem.id === item)) {
        //       this.fastFilter.archiveStatus.push(obj)
        //     }
        //   }
        // })
        filter.certificates.forEach(item => {
          const certificate = this.programCertificates.find(objItem => objItem.id === item)
          if (certificate) {
            const obj = { id: item, label: `Сертификаты: ${certificate.name}` }
            if (!this.fastFilter.certificates.find(objItem => objItem.id === item)) {
              this.fastFilter.certificates.push(obj)
            }
          }
        })
        filter.certPaymentStatus.forEach(item => {
          const certPaymentStatus = this.certPaymentStatusEnum.find(objItem => objItem.id === item)
          if (certPaymentStatus) {
            const obj = { id: item, label: `Оплаты: ${certPaymentStatus.label}` }
            if (!this.fastFilter.certPaymentStatus.find(objItem => objItem.id === item)) {
              this.fastFilter.certPaymentStatus.push(obj)
            }
          }
        })
        filter.certOrderStatus.forEach(item => {
          const certOrderStatus = this.certOrderStatusEnum.find(objItem => objItem.id === item)
          if (certOrderStatus) {
            const obj = { id: item, label: `Статусы: ${certOrderStatus.label}` }
            if (!this.fastFilter.certOrderStatus.find(objItem => objItem.id === item)) {
              this.fastFilter.certOrderStatus.push(obj)
            }
          }
        })
        filter.certMerchantOrderStatus.forEach(item => {
          const certMerchantOrderStatus = this.certMerchantOrderStatusEnum.find(objItem => objItem.id === item)
          if (certMerchantOrderStatus) {
            const obj = { id: item, label: `Выплаты: ${certMerchantOrderStatus.label}` }
            if (!this.fastFilter.certMerchantOrderStatus.find(objItem => objItem.id === item)) {
              this.fastFilter.certMerchantOrderStatus.push(obj)
            }
          }
        })
        filter.buyers.forEach(item => {
          const buyers = this.buyers.find(objItem => objItem.id === item)
          if (buyers) {
            const obj = { id: item, label: `Покупатели: ${buyers.userName}` }
            if (!this.fastFilter.buyers.find(objItem => objItem.id === item)) {
              this.fastFilter.buyers.push(obj)
            }
          }
        })

        // if (filter.issueDate.startDate !== null && filter.issueDate.endDate !== null) {
        //   const obj = { id: 'issueDate', label: `Выпущен: ${this.$moment(filter.issueDate.startDate).format('DD.MM.YYYY')} - ${this.$moment(filter.issueDate.endDate).format('DD.MM.YYYY')}` }
        //   this.fastFilter.issueDate = obj
        // }
      },
      clearItemFastFilter (field, item) {
        // if (field === 'issueDate') {
        //   this.fastFilter.issueDate.id = null
        //   this.fastFilter.issueDate.label = null
        //
        //   const filter = JSON.parse(JSON.stringify(this.filterStore))
        //
        //   // filter[field].startDate = null
        //   // filter[field].endDate = null
        //
        //   this.$store.commit('account/certificate/filter/filter', JSON.parse(JSON.stringify(filter)))
        // } else {
        const i = this.fastFilter[field].findIndex(objItem => objItem.id === item.id)
        if (i !== -1) this.fastFilter[field].splice(i, 1)

        console.log('sdjkfhsdkjfhdskjf')
        console.log(this.fastFilter)
        console.log('sdjkfhsdkjfhdskjf')

        const filter = JSON.parse(JSON.stringify(this.filterStore))
        const j = filter[field].findIndex(elem => elem.id === elem.id)
        if (j !== -1) {
          filter[field].splice(j, 1)
        }

        this.$store.commit('account/certificate/filter/filter', JSON.parse(JSON.stringify(filter)))
        // }
      },
      clearFastFilter () {
        this.filter = JSON.parse(JSON.stringify(this.filterDefault))
        this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
        this.$store.commit('account/certificate/filter/filter', JSON.parse(JSON.stringify(this.filter)))
      },
      async querySearchClient (search) {
        if (search.length >= 3) {
          this.loading = true
          const item = {
            program_id: this.program.id,
            search,
          }
          await this.$store.dispatch('account/certificate/filter/foundClients', item)
          this.loading = false
        }
      },
      close () {
        this.show = false
      },
      apply () {
        this.$store.commit('account/certificate/filter/filter', this.filter)
        this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
        this.setFastFilter(this.filter)
        this.show = false
      },
    },
  }
</script>

<style lang="scss" scoped>
.app__filter {
  position: relative;

  .app__filter-block {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #FFFFFF;
    border: 1px solid #E8E8ED;
    box-sizing: border-box;
    box-shadow: 0px 12px 24px rgba(88, 93, 106, 0.1);
    border-radius: 10px;
    z-index: 2;

    .app__filter-content {
      padding: 8px 20px;

      .app__filter-content-header {
        margin-bottom: 4px;
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        letter-spacing: 0.1px;
        color: #2A2A34;
      }

      .app__filter-content-chip {
        display: inline-block;
        margin: 8px 8px 0 0;
        padding: 10px 12px;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 17px;
        color: #9191A1;
        background: #F2F2F7;
        border-radius: 8px;
        cursor: pointer;
        height: 37px;
      }

      .app__filter-content-chip-active {
        background: #EBF1FF;
        color: #4776E6;
      }

      .app__filter-content-checkbox {
        display: inline-block;
        margin-right: 20px;
        font-style: normal;
        font-weight: 500;
        font-size: 15px;
        line-height: 21px;
        color: #9191A1;

        input {
          display: inline-block;
          margin-right: 11px;
        }

        div {
          display: inline-block;
          position: relative;
          top: -1px;
        }
      }
    }
  }
}
.app__filter-block-input {
  display: flex;
  align-items: center;
  min-height: 45px;
  color: #9191A1;
  border-bottom: 1px solid #D7D7E0;
  box-sizing: border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  .app__filter-block-input-icon-prepend {
    margin: 6px 0 6px 12px;
  }

  .app__filter-block-input-icon-append {
    margin: 6px 12px 6px 0;
  }

  .app__filter-block-input-field {
    display: inline;
    outline: none !important;
    margin: 13px 0;
    padding: 0 10px;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
  }
}

.app__filter-block-icon-close {
  color: #B5B5C4 !important;
  cursor: pointer;
}

.app__filter-block-icon-check {
  width: 30px !important;
  height: 28px !important;
  position: relative;
  top: -1px;
  color: #4776E6 !important;
  cursor: pointer;
}

.app__filter-chip {
  display: inline-flex;
  align-items: center;
  background-color: #EBF1FF;
  border-radius: 6px;
  max-width: 100%;
  margin: 3px;
  padding: 0 6px 0 12px;
  white-space: nowrap;

  .app__filter-chip-content {
    align-items: center;
    display: inline-flex;
    height: 37px;
    max-width: 100%;
    color: #4776E6;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 17px;
  }

  .app__filter-chip-icon-append {
    margin: 0 0 0 6px;
    color: #4776E6;
  }
}

.app__filter-content-chip-icon {
  img {
    height: 17px;
    width: 17px;
  }

  span {
    position: relative;
    top: -4px;
  }
}

.calendar-icon {
  float: right;
  padding-right: 14px;
  svg {
    color: #B5B5C4;
    height: 17px;
    width: 17px;
  }
}

.date-range-value {
  float: left;
}

.archive-status-btn {
  text-transform: lowercase;
  font-family: Gilroy;
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 22px;
  &::before {
    background-color: transparent!important;
  }
}

.archive-status-menu-item {
  .v-list-item__title {
    font-family: Gilroy;
    font-style: normal;
    font-size: 15px;
    line-height: 21px;
    color: rgb(145, 145, 161) !important;

    svg {
      font-size: 26px;
    }
  }
}

.archive-status-check-icon {
  float: right;
  position: relative;
  top: -6px;
  color: #4776e6!important;
}

.archive-status-chevron {
  font-size: 14px;
  padding-left: 7px;
}
</style>
