<template>
      <div>
            <v-data-table
              :headers="headers"
              :items="certificates"
              :single-expand="true"
              :options="tableOptions"
              :expanded.sync="expanded"
              item-key="id"
              show-expand
              class="plus-table"
              hide-default-footer
              @click:row="details"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  More info about {{ item.id }}
                </td>
              </template>

              <template v-slot:item.data-table-expand="{ expand, isExpanded }">
                <span
                  class="iconify"
                  data-icon="bi:chevron-right"
                  data-inline="false"
                  @click="expand(!isExpanded)"
                 />
              </template>

              <template v-slot:item.certificate.name="{ item }">
                <div class="td-padding-wrapper">
                  <div class="td-content-main">
                    {{ item.certificate.name }}
                  </div>
                  <div
                    class="hint"
                    style="color: #4776E6;"
                    v-if="item.order"
                  >
                    {{ item.order.num }}
                  </div>
                </div>
              </template>

              <template v-slot:item.user.UserName="{ item }">
                <div class="avatar">
                  <img :src="item.user.avatar">
                </div>
                <div class="td-content-wrapper">
                  <div class="td-content-main">
                    {{ item.user.UserName }}
                  </div>
                  <div
                    v-if="item.user.last_activity"
                    class="hint"
                    style="color: #9191A1"
                  >
                    Был(а) в сети {{ $moment(item.user.last_activity).format('DD.MM.YYYY\u00A0HH:mm') }}
                  </div>
                </div>
              </template>

              <template v-slot:item.nominal.selling_price="{ item }">
                <span style="float: right">
                  {{ formatBum(item.nominal.selling_price) }} &#8381
                </span>
              </template>

              <template v-slot:item.payment_status="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-img class="status-icon" align="center" height="21" width="21" v-bind="attrs" v-on="on" :src="paymentStatusIcon(item.payment_status)"></v-img>
                  </template>
                  <span>{{ paymentStatusTooltip(item.payment_status) }}</span>
                </v-tooltip>
              </template>

              <template v-slot:item.status="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-img
                        class="status-icon"
                        align="center"
                        height="21"
                        width="21"
                        v-bind="attrs"
                        v-on="on"
                        :src="statusIcon(item.status)"></v-img>
                  </template>
                  <span>{{ statusTooltip(item.status) }}</span>
                </v-tooltip>
              </template>

              <template v-slot:item.merchant_order_status="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-img
                        class="status-icon"
                        align="center"
                        height="21"
                        width="21"
                        v-bind="attrs"
                        v-on="on"
                        :src="merchantOrderStatusIcon(item.merchant_order_status)"></v-img>
                  </template>
                  <span>{{ merchantOrderStatusTooltip(item.merchant_order_status) }}</span>
                </v-tooltip>
              </template>

              <template v-slot:item.date_issued="{ item }">
                <div
                  v-if="item.date_issued"
                  class="td-content-wrapper"
                >
                  <div class="td-content-main">
                    {{ $moment(item.date_issued).format('DD.MM.YYYY') }}
                  </div>
                  <div
                    v-if="item.expires_at"
                    class="hint"
                  >
                    {{ $moment(item.expires_at).format('DD.MM.YYYY') }}
                  </div>
                </div>
              </template>

              <template v-slot:item.created_at="{ item }">
                <div
                    v-if="item.created_at"
                    class="td-content-wrapper"
                >
                  <div class="td-content-main">
                    {{ $moment(item.created_at).format('DD.MM.YYYY') }}
                  </div>
                  <div
                      v-if="item.created_at"
                      class="hint"
                  >
                    в {{ $moment(item.created_at).format('HH:MM:SS') }}
                  </div>
                </div>
              </template>

      <template v-slot:item.used_at="{ item }">
        <div
          v-if="item.used_at"
          class="td-content-wrapper"
        >
          <div class="td-content-main">
            {{ $moment(item.used_at).format('DD.MM.YYYY') }}
          </div>
          <div class="hint">
            в {{ $moment(item.used_at).format('HH:mm') }}
          </div>
        </div>
      </template>
    </v-data-table>

        <v-row
          align="center"
          class="pagination"
        >
          <v-col cols="3" class="pagination-total">
            <span>{{ totalCount }} операций на {{ pagesCount }} страницах</span>
          </v-col>

          <v-col cols="2" class="pagination-per-page">
            <v-select
                v-model="tableOptions.itemsPerPage"
                class="pagination-select"
                :items="paginationOptions"
                item-text="text"
                item-value="value"
                append-icon="fas fa-chevron-down"
                dense
            />
          </v-col>

          <v-col cols="7">
            <div class="text-center">
              <v-pagination
                v-model="tableOptions.page"
                next-icon="fas fa-chevron-right"
                prev-icon="fas fa-chevron-left"
                :length="pagesCount"
                :total-visible="7"
                circle
              />
            </div>
          </v-col>
        </v-row>

        <v-navigation-drawer
            v-model="showDetails"
            class="cert-details"
            absolute
            right
            temporary
            width="500"
        >
          <div class="details-header" @click="closeCertDetails">
            <v-icon>$iconify_arrow-left</v-icon>
            <span class="body-s-semibold">Назад</span>
          </div>

          <div class="cert-details-content">
            <div class="cert-details-property d-flex" v-if="detailedCert.used_at">
              <div class="cert-details-used body-s-semibold">Использован {{ $moment(detailedCert.used_at).format('DD.MM.YYYY,\u00A0HH:mm') }}</div>
            </div>

            <div class="cert-details-cert-name d-flex" v-if="detailedCert.certificate">
              <div class="title-m-bold">{{ detailedCert.certificate.name }}</div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div  class="body-l-semibold">{{ detailedCert.nominal.selling_price }} &#8381</div>
            </div>

            <div class="cert-details-block d-flex" v-if="detailedCert.certificate">
              <div class="body-l-semibold">Сертификат</div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div class="cert-details-prop-name body-s-semibold">№ заказа</div>
              <div class="cert-details-prop-value body-m-medium">{{ detailedCert.order.num }}</div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div class="cert-details-prop-name body-s-semibold">ID сертификата</div>
              <div class="cert-details-prop-value body-m-medium">{{ detailedCert.certificate.id }}</div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div class="cert-details-prop-name body-s-semibold">Выпущен</div>
              <div v-if="detailedCert.issued" class="cert-details-prop-value body-m-medium">{{ $moment(detailedCert.date_issued).format('DD.MM.YYYY,\u00A0HH:mm') }}</div>
              <div v-else class="cert-details-status-date body-m-medium">-</div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div class="cert-details-prop-name body-s-semibold">Истекает</div>
              <div v-if="detailedCert.expires_at" class="cert-details-status-date body-s-semibold">{{ $moment(detailedCert.expires_at).format('DD.MM.YYYY,\u00A0HH:mm') }}</div>
              <div v-else class="cert-details-status-date body-m-regular">-</div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div class="cert-details-prop-name body-s-semibold">Статус</div>
              <div>
                <v-img height="17px" width="17px" class="cert-details-status-icon" :src="statusIcon(detailedCert.status)"></v-img>
              </div>
              <div class="cert-details-status body-m-semibold">
                <span>{{ statusTooltip(detailedCert.status) }}</span>
              </div>
              <div class="cert-details-status-date body-m-medium">
                <span>{{ statusDate(detailedCert) }}</span>
              </div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div class="cert-details-prop-name body-s-semibold">Оплата</div>
              <div>
                <v-img height="17px" width="17px" class="cert-details-status-icon" :src="paymentStatusIcon(detailedCert.payment_status)"></v-img>
              </div>
              <div :class="detailedCert.payment_status === 'wait' ? 'cert-details-payment-wait-status body-m-semibold' : 'cert-details-payment-status body-m-semibold'">
                <span>{{ paymentStatusTooltip(detailedCert.payment_status) }}</span>
              </div>
              <div v-if="detailedCert.paid_at" class="cert-details-status-date body-m-medium">
                <span>{{ this.$moment(detailedCert.paid_at).format('DD.MM.YYYY,\u00A0HH:mm') }}</span>
              </div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div class="cert-details-prop-name body-s-semibold">Выплата</div>
              <div class="cert-property body-s-semibold">
                <v-img height="17px" width="17px" class="cert-details-status-icon" :src="merchantOrderStatusIcon(detailedCert.merchant_order_status)"></v-img>
              </div>
              <div
                  :class="detailedCert.merchant_order_status !== 'not_paid' && detailedCert.merchant_order_status !== 'wait' ? 'cert-details-success-status body-m-semibold' : 'cert-details-status body-m-semibold'"
              >
                <span>{{ merchantOrderStatusTooltip(detailedCert.merchant_order_status) }}</span>
              </div>
            </div>

            <div class="cert-details-divider">
                <v-divider />
            </div>

            <div class="cert-details-block d-flex" v-if="detailedCert.certificate">
              <div class="body-l-semibold">Оплата</div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate && detailedCert.order">
              <div class="cert-details-prop-name body-s-semibold">ID</div>
              <div class="cert-details-prop-value body-m-medium"> {{ detailedCert.order.id }} </div>
            </div>

            <div
                class="cert-details-property d-flex"
                v-if="detailedCert.certificate && detailedCert.order.last_paid_payment && detailedCert.order.last_paid_payment.paid_at"
            >
              <div class="cert-details-prop-name body-s-semibold">Статус</div>
              <div style="display: flex; align-items: center;" class="cert-details-success-status body-m-medium">
                <v-icon>$iconify_bx-check</v-icon>
                <span>Выполнена</span>
              </div>
              <div class="cert-details-status-date body-m-medium"> {{ $moment(detailedCert.order.last_paid_payment.paid_at).format('DD.MM.YYYY,\u00A0HH:mm') }} </div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div class="cert-details-prop-name body-s-semibold">Тип</div>
              <div v-if="detailedCert.order.last_paid_payment" class="cert-details-prop-value body-m-medium"> {{ paymentSystemType(detailedCert.order.last_paid_payment.type) }} </div>
              <div v-else class="cert-details-prop-value body-m-medium"> - </div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div class="cert-details-prop-name body-s-semibold">Создана</div>
              <div v-if="detailedCert.order.last_paid_payment" class="cert-details-status-date body-m-medium"> {{ $moment(detailedCert.order.last_paid_payment.created_at).format('DD.MM.YYYY,\u00A0HH:mm') }} </div>
              <div v-else class="cert-details-status-date body-m-medium">-</div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate">
              <div class="cert-details-prop-name body-s-semibold">Истекает</div>
              <div v-if="detailedCert.order.last_paid_payment && detailedCert.order.last_paid_payment.IsExpired" class="cert-details-status-date body-m-medium"> {{ $moment(detailedCert.order.last_paid_payment.expired_at).format('DD.MM.YYYY,\u00A0HH:mm') }} </div>
              <div v-else class="cert-details-status-date body-m-medium">-</div>
            </div>

            <div class="cert-details-property d-flex" v-if="detailedCert.certificate && detailedCert.order.last_paid_payment">
              <div class="cert-details-prop-name body-s-semibold">Реквизиты</div>
              <div v-if="detailedCert.order.last_paid_payment" class="cert-details-prop-value body-m-medium"> {{ detailedCert.order.last_paid_payment.transaction_id }} </div>
              <div v-else class="cert-details-prop-value body-m-medium">-</div>
            </div>

            <div v-if="detailedCert" class="cert-details-user-block">
              <div class="cert-details-user-content">
                <div class="cert-details-user d-flex">
                  <img
                      v-if="detailedCert.user"
                      :src="detailedCert.user.avatar"
                  />
                </div>
                <div class="cert-details-user-info">
                  <div v-if="detailedCert.user">
                    <div class="body-l-semibold">
                      {{ detailedCert.user.UserName }}
                    </div>
                    <div
                        v-if="detailedCert.user.last_activity"
                        class="cert-details-user-activity body-xs-semibold"
                    >
                      Был(а) в сети {{ $moment(detailedCert.user.last_activity).format('DD.MM.YYYY\u00A0HH:mm') }}
                    </div>

                    <div class="cert-details-user-contact d-flex">
                      <v-icon>$iconify_bi-phone</v-icon>
                      <div class="body-m-medium" v-if="detailedCert.user.phone">
                        {{ detailedCert.user.phone }}
                      </div>
                      <div v-else>-</div>
                    </div>
                    <div class="cert-details-user-contact d-flex">
                      <v-icon>$iconify_carbon-email</v-icon>
                      <div class="body-m-medium" v-if="detailedCert.user.email">
                        {{ detailedCert.user.email }}
                      </div>
                      <div v-else>-</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-navigation-drawer>

      </div>
</template>

<script>
  export default {
    name: 'Certificates',
    data () {
      return {
        showDetails: false,
        detailedCert: {},
        filterDrawer: false,
        tableOptions: {
          page: 1,
          itemsPerPage: 5,
        },
        paginationOptions: [
          {
            text: '5 на странице',
            value: 5,
          },
          {
            text: '10 на странице',
            value: 10,
          },
          {
            text: '15 на странице',
            value: 15,
          },
        ],
        expanded: [],
        headers: [
          {
            text: 'Сертификат',
            align: 'start',
            value: 'certificate.name',
          },
          {
            text: 'Цена',
            value: 'nominal.selling_price',
            align: 'end',
          },
          {
            text: 'Покупатель',
            value: 'user.UserName',
          },
          {
            text: 'Оплата',
            value: 'payment_status',
            align: 'center',
          },
          {
            text: 'Статус',
            value: 'status',
            align: 'center',
          },
          {
            text: 'Выплата',
            value: 'merchant_order_status',
            align: 'center',
          },
          {
            text: 'Дата создания',
            value: 'created_at',
          },
          {
            text: 'Выпущен',
            value: 'date_issued',
          },
          {
            text: 'Использован',
            value: 'used_at',
          },
          {
            text: '',
            value: 'data-table-expand',
          },
        ],
      }
    },
    computed: {
      pagesCount () {
        const count = Math.ceil(this.totalCount / this.tableOptions.itemsPerPage)
        if (count) {
          return count
        }
        return 1
      },
      programs () {
        return this.$store.getters['company/program/programs']
      },
      program () {
        return this.$store.getters['company/program/program']
      },
      merchantId () {
        return this.$store.getters['auth/auth/merchant_id']
      },
      certificates () {
        console.log(this.$store.getters['account/certificate/certificate/certificates'])
        return this.$store.getters['account/certificate/certificate/certificates']
      },
      totalCount () {
        return this.$store.getters['account/certificate/certificate/totalCount']
      },
      filter () {
        return this.$store.getters['account/certificate/filter/filter']
      },
    },
    watch: {
      'tableOptions.page' (v) {
        console.log(this.tableOptions)
        if (v) this.fetchData()
      },
      'tableOptions.itemsPerPage' (v) {
        console.log(this.tableOptions)
        if (v) this.fetchData()
      },
      filter (v) {
        if (v) this.fetchData()
      },
      program (v) {
        if (v) {
          this.$store.dispatch('account/certificate/certificate/programCertificates', v.id)
          this.$store.dispatch('account/certificate/buyers/buyers', v.id)
          this.fetchData()
        }
      },
      'filter.archiveStatus.id' (v) {
        if (v) {
          this.fetchData()
        }
      },
    },
    created () {
      this.fetchData()
    },
    methods: {
      paymentSystemType (type) {
        let result = ''
        switch (type) {
          case 'SBERBANK': result = 'Сбербанк'; break
          case 'PLUS_CASH': result = 'Оплачено на кассе'; break
          default: result = ''; break
        }
        return result
      },
      closeCertDetails () {
        this.showDetails = false
      },
      details (item) {
        console.log(item)
        this.showDetails = true
        this.detailedCert = item
      },
      formatBum (num) {
        var int = String(Math.trunc(num))
        if (int.length <= 3) return int
        var space = 0
        var number = ''

        for (var i = int.length - 1; i >= 0; i--) {
          if (space === 3) {
            number = ' ' + number
            space = 0
          }
          number = int.charAt(i) + number
          space++
        }

        return number
      },
      statusIcon (status) {
        if (status === 'wait_payment') {
          status = 'wait'
        }
        return require('@/icons/svg/' + status + '.svg')
      },
      statusTooltip (status) {
        switch (status) {
          case 'deleted':
            status = 'Удален'
            break
          case 'paid':
            status = 'Оплачен'
            break
          case 'wait_payment':
            status = 'Ожидает оплаты'
            break
          case 'used':
            status = 'Использован'
            break
          case 'new':
            status = 'Размещен'
            break
          case 'issued':
            status = 'Выпущен'
            break
        }
        return status
      },
      statusDate (item) {
        let date
        switch (item.status) {
          case 'deleted':
            date = this.$moment(item.deleted_at).format('DD.MM.YYYY,\u00A0HH:mm')
            break
          case 'paid':
            date = this.$moment(item.paid_at).format('DD.MM.YYYY,\u00A0HH:mm')
            break
          case 'wait_payment':
            date = ''
            break
          case 'used':
            date = this.$moment(item.used_at).format('DD.MM.YYYY,\u00A0HH:mm')
            break
          case 'new':
            date = this.$moment(item.date_issued).format('DD.MM.YYYY,\u00A0HH:mm')
            break
          case 'issued':
            date = this.$moment(item.date_issued).format('DD.MM.YYYY,\u00A0HH:mm')
            break
        }
        return date
      },
      merchantOrderStatusIcon (status) {
        // switch (status) {
        //   case 'not_required':
        //     status = 'dont_needed'
        //     break
        //   case 'succeded':
        //     status = 'paid'
        //     break
        // }
        return require('@/icons/svg/payments/' + status + '.svg')
      },
      merchantOrderStatusTooltip (status) {
        switch (status) {
          case 'not_paid':
            status = 'Не выплачено'
            break
          case 'not_required':
            status = 'Не требуется'
            break
          case 'succeded':
            status = 'Выплачено'
            break
          case 'wait':
            status = 'Ожидает'
            break
        }
        return status
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
      paymentStatusTooltip (status) {
        switch (status) {
          case 'SBERBANK':
            status = 'Оплачен картой'
            break
          case 'PLUS_CASH':
            status = 'Оплачен на кассе'
            break
          case 'wait':
            status = 'Ожидает оплаты'
            break
          default:
            status = 'Оплачен другим способом'
        }
        return status
      },
      fetchData () {
        this.loadingList = true
        this.$store
          .dispatch('account/certificate/certificate/list', {
            program_id: this.program.id,
            filter: this.filter,
            offset: (this.tableOptions.page * this.tableOptions.itemsPerPage) - this.tableOptions.itemsPerPage,
            limit: this.tableOptions.itemsPerPage,
          })
          .finally(() => {
            this.loadingList = false
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  //@import './src/styles/variables';
  //
  //.v-navigation-drawer {
  //  width: 483px!important;
  //  .details-header {
  //    display: flex!important;
  //    align-items: center;
  //    padding-left: 34px;
  //    padding-top: 36px;
  //    color: $primary-base;
  //    //
  //    //&:hover {
  //    //  cursor: pointer
  //    //};
  //    //
  //    //span {
  //    //  margin-left: 8px
  //    //};
  //  }
  //}

  .status-icon {
    margin-left: 40%!important;
  }

</style>
