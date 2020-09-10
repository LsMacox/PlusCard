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
                    v-if="!item.order"
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
                  {{ item.nominal.selling_price }} &#8381
                </span>
              </template>

              <template v-slot:item.payment_status="{ item }">
                <img :src="paymentStatusIcon(item.payment_status)">
              </template>

              <template v-slot:item.status="{ item }">
                <img :src="statusIcon(item.status)">
              </template>

              <template v-slot:item.merchant_order_status="{ item }">
                <img :src="merchantOrderStatusIcon(item.merchant_order_status)">
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
      </div>
</template>

<script>
  export default {
    name: 'Certificates',
    data () {
      return {
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
        if (v) this.fetchData()
      },
    },
    created () {
      this.fetchData()
    },
    methods: {
      statusIcon (status) {
        if (status === 'wait_payment') {
          status = 'wait'
        }
        return require('@/icons/svg/' + status + '.svg')
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

<style scoped>

</style>
