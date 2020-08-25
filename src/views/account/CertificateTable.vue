<template>
  <v-container>
    <v-row>
      <v-form>
        <v-container>
          <v-row
            no-gutters
          >
            <v-col
              cols="3"
              style="padding-right: 20px"
            >
              <v-text-field
                outlined
                placeholder="Поиск сертификатов, клиентов"
              >
                <template v-slot:prepend-inner>
                  <span
                    class="iconify"
                    data-icon="ant-design:search-outlined"
                    data-inline="false"
                  />
                </template>
              </v-text-field>
            </v-col>

            <v-col
              cols="2"
              style="padding-right: 20px"
            >
              <v-select
                v-model="certPaymentStatus"
                outlined
                placeholder="Статус оплаты"
                :items="certPaymentStatusEnum"
                item-text="label"
                item-value="id"
              />
            </v-col>

            <v-col
              cols="2"
              style="padding-right: 20px"
            >
              <v-select
                v-model="certMerchantOrderStatus"
                outlined
                placeholder="Статус выплаты"
                :items="certMerchantOrderStatusEnum"
                item-text="label"
                item-value="id"
              />
            </v-col>

            <v-col
              cols="3"
              style="padding-right: 20px"
            >
              <v-select
                v-model="certOrderStatus"
                outlined
                placeholder="Статус сертификата"
                :items="certOrderStatusEnum"
                item-text="label"
                item-value="id"
              />
            </v-col>

            <v-col cols="2">
              <v-chip
                class="advanced-filter"
              >
                <span
                  class="iconify"
                  data-icon="fa:sliders"
                  data-inline="false"
                />
                <span>
                  Все фильтры
                </span>
              </v-chip>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <v-col
        cols="12"
        style="width: 1024px"
      >
        <v-data-table
          :headers="headers"
          :items="certificates"
          :single-expand="true"
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
                Был(а) в сети {{ $moment(item.user.last_activity).format("DD.MM.YYYY\u00A0HH:mm") }}
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
                {{ $moment(item.date_issued).format("DD.MM.YYYY") }}
              </div>
              <div
                v-if="item.expires_at"
                class="hint"
              >
                {{ $moment(item.expires_at).format("DD.MM.YYYY") }}
              </div>
            </div>
          </template>

          <template v-slot:item.used_at="{ item }">
            <div
              v-if="item.used_at"
              class="td-content-wrapper"
            >
              <div class="td-content-main">
                {{ $moment(item.used_at).format("DD.MM.YYYY") }}
              </div>
              <div class="hint">
                в {{ $moment(item.used_at).format("HH:mm") }}
              </div>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row
      align="center"
      class="pagination"
    >
      <v-col class="pagination-total">
        <span>Всего {{ totalCount }}</span>
      </v-col>

      <v-col cols="8">
        <div class="text-center">
          <v-pagination
            v-model="page"
            next-icon="fas fa-chevron-right"
            prev-icon="fas fa-chevron-left"
            :length="pagesCount"
            :total-visible="7"
            circle
          />
        </div>
      </v-col>

      <v-col class="pagination-per-page">
        <v-select
          v-model="perPage"
          class="pagination-select"
          :items="paginationOptions"
          item-text="text"
          item-value="value"
          append-icon="fas fa-chevron-down"
          dense
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import FuzzySearch from 'fuzzy-search'

  var arraySort = require('array-sort')

  var statusStyles = Object.freeze({
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
    name: 'Certificates',
    data () {
      return {
        certPaymentStatus: String,
        certMerchantOrderStatus: String,
        certOrderStatus: String,
        page: 1,
        perPage: 10,
        paginationOptions: [
          { text: '5 на странице', value: 5 },
          { text: '10 на странице', value: 10 },
          { text: '15 на странице', value: 15 },
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
          },
          {
            text: 'Покупатель',
            value: 'user.UserName',
          },
          {
            text: 'Оплата',
            value: 'payment_status',
          },
          {
            text: 'Статус',
            value: 'status',
          },
          {
            text: 'Выплата',
            value: 'merchant_order_status',
          },
          {
            text: 'Выпущен',
            value: 'date_issued',
          },
          {
            text: 'Использован',
            value: 'used_at',
          },
          { text: '', value: 'data-table-expand' },
        ],
        certPaymentStatusEnum: [
          {
            id: 'wait',
            label: 'Не определен',
            short: 'Не определен',
            icon: '/icons/payment-wait.svg',
            style: statusStyles.default,
          },
          {
            id: 'wait',
            label: 'Ожидает оплаты',
            short: 'Ожидает оплаты',
            icon: '/icons/payment-wait.svg',
            style: statusStyles.default,
          },
          {
            id: 'SBERBANK',
            label: 'Оплачен картой',
            short: 'Оплачен картой',
            icon: '/icons/payment-card.svg',
            style: statusStyles.green,
          },
          {
            id: 'PLUS_OTHER',
            label: 'Оплата другая',
            short: 'Оплата другая',
            icon: '/icons/payment-cash.svg',
            style: statusStyles.lightGreen,
          },
          {
            id: 'PLUS_CASH',
            label: 'Оплачен на кассе',
            short: 'Оплачен на кассе',
            icon: '/icons/payment-cash.svg',
            style: statusStyles.lightGreen,
          },
        ],
        certMerchantOrderStatusEnum: [
          {
            id: 'default',
            label: 'Не определен',
            short: 'Не определен',
            icon: '/icons/merchant_order_cert.not_required.svg',
            style: statusStyles.default,
          },
          {
            id: 'not_paid',
            label: 'Не выплачен',
            short: 'Не выплачен',
            icon: '/icons/merchant_order_cert.not_paid.svg',
            style: statusStyles.default,
          },
          {
            id: 'not_required',
            label: 'Не подлежит выплате',
            short: 'Не подлежит выплате',
            icon: '/icons/merchant_order_cert.not_required.svg',
            style: statusStyles.default,
          },
          {
            id: 'wait',
            label: 'Ожидает оплаты',
            short: 'Ожидает оплаты',
            icon: '/icons/merchant_order_cert.wait.svg',
            style: statusStyles.default,
          },
          {
            id: 'succeded',
            label: 'Выплачен',
            short: 'Выплачен',
            icon: '/icons/merchant_order_cert.succeded.svg',
            style: statusStyles.blue,
          },
          {
            id: 'canceled',
            label: 'Отменена',
            short: 'Отменена',
            icon: '/icons/merchant_order_cert.not_required.svg',
            style: statusStyles.black,
          },
        ],
        certOrderStatusEnum: [
          {
            id: 'default',
            label: 'Не определен',
            short: 'Не определен',
            style: statusStyles.default,
          },
          {
            id: 'new',
            label: 'Размещен',
            short: 'Размещен',
            style: statusStyles.default,
          },
          {
            id: 'reserved',
            label: 'Зарезервирован',
            short: 'Зарезервирован',
            style: statusStyles.default,
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
      pagesCount () {
        return Math.ceil(this.totalCount / this.perPage)
      },
      DisplayCertColumns () {
        let columnList = []
        if (this.filterStatus === 'storage') {
          columnList = [
            this.CertColumns.CertificateName,
            this.CertColumns.Order,
            this.CertColumns.SellingPrice,
            this.CertColumns.Status,
            this.CertColumns.CreatedAt,

          ]
        } else {
          columnList = [
            this.CertColumns.UserAvatar,
            this.CertColumns.UserName,
            this.CertColumns.UserContacts,
            this.CertColumns.Order,
            this.CertColumns.SellingPrice,
            this.CertColumns.PaymentStatus,
            this.CertColumns.MerchantOrderStatus,
            this.CertColumns.Status,
            this.CertColumns.DateIssued,
            this.CertColumns.UsedAt,
          ]
        }

        if (this.$IsDebugMode()) {
          columnList.unshift(this.CertColumns.ID)
        }
        return columnList
      },
      isFilter () {
        return !this.isEmpty(this.filter) && this.filter.enable
      },
      loadingRequest () {
        return this.$store.getters['template/shared/loadingRequest']
      },
      programs () {
        return this.$store.getters['brand/program/programs']
      },
      program () {
        // return this.$store.getters['brand/program/program']
        return 164
      },
      merchant () {
        return this.$store.getters['auth/merchant/merchant']
      },
      certificates () {
        return this.$store.getters['certificate/certificates']
          .map(item => {
            // Vue.set(item, 'loadingRequest', false)
            return item
          // return Object.assign(item, {
          //   loadingRequest: false
          // });
          })
          .filter(
            // item => this.program && item.certificate.program_id == this.program.id,
            item => this.program && item.certificate.program_id === this.program,
          ) // filter by program
      },
      totalCount () {
        return this.$store.getters['certificate/totalCount']
      },
      storage_certificates_count () {
        return this.certificates.filter(this.GetStatusFilter('storage')).length
      },
      active_certificates_count () {
        return this.certificates.filter(this.GetStatusFilter('active')).length
      },
      archive_certificates_count () {
        return this.certificates.filter(this.GetStatusFilter('archive')).length
      },
      certificates_sorted () {
        if (this.certificates_searched && this.certificates_searched.length > 0) {
          return arraySort(this.certificates_searched, this.sortOptions.prop, {
            reverse: this.sortOptions.order !== 'ascending',
          })
        } else return []
      },
      certificates_table_data () {
        if (this.certificates_chunked.length >= this.listQuery.page) {
          return this.certificates_chunked[this.listQuery.page - 1]
        } else {
          return []
        }
      },
      certificates_chunked () {
        const chunkedList = []
        var i
        var j
        var temparray
        var chunk = this.listQuery.limit
        for (i = 0, j = this.certificates_sorted.length; i < j; i += chunk) {
          temparray = this.certificates_sorted.slice(i, i + chunk)
          chunkedList.push(temparray)
        }
        return chunkedList
      },
      certificateSearcher () {
        return new FuzzySearch(
          this.certificates_filtered,
          ['user.UserName', 'user.phone', 'user.email', 'order.num', 'number'],
          {
            caseSensitive: false,
          },
        )
      },
      certificates_searched () {
        // Поиск
        const search_text_trim = this.search_text.trim()

        if (search_text_trim && search_text_trim.length >= 3) {
          return this.certificateSearcher.search(search_text_trim)
        } else {
          return this.certificates_filtered
        }
      },
      certificates_filtered () {
        let res = this.certificates

        // res = res.filter(item => item.certificate.program.id == this.program.id);
        /// /console.log('certificates_filtered1', res.length)
        // Фильтрация по вкладкам
        res = res.filter(this.GetStatusFilter(this.filterStatus))
        // console.log("certificates_filtered2", res.length);
        // if (this.filterStatus == "active") {
        //   res = res.filter(item => item.archived_at == null && item.user_id != null);
        // } else if (this.filterStatus == "archive") {
        //   //sort archived_at desc
        //   res = res
        //     .filter(item => item.archived_at != null && item.user_id != null)
        //     .sort((a, b) => {
        //       return (
        //         moment(b.archived_at).valueOf() - moment(a.archived_at).valueOf()
        //       );
        //     });
        // } else if (this.filterStatus == "storage"){
        //    res = res.filter(item => item.user_id == null);
        // }

        if (this.isFilter) {
          if (this.filter.id) {
            res = res.filter(item => item.id == this.filter.id)
          }
          // Имя серта
          if (this.filter.name) {
            const search_name = this.filter.name.toLowerCase().trim()
            res = res.filter(item =>
              item.certificate.name
                .toLowerCase()
                .trim()
                .includes(search_name),
            )
          }
          // Номер
          if (this.filter.number) {
            res = res.filter(
              item => item.number && item.number.includes(this.filter.number),
            )
          }
          // ФИО
          if (this.filter.fio) {
            const search_fio = this.filter.fio.trim().toLowerCase()
            res = res.filter(item =>
              item.user.FullName.toLowerCase().includes(this.filter.fio),
            )
          }
          // Телефон или почта
          if (this.filter.phoneOrEmail) {
            res = res.filter(
              item =>
                (item.user.phone &&
                  item.user.phone.includes(this.filter.phoneOrEmail)) ||
                (item.user.email &&
                  item.user.email.includes(this.filter.phoneOrEmail)),
            )
          }

          // Номинал
          if (this.filter.nominal) {
            res = res.filter(
              item =>
                item.nominal.nominal &&
                item.nominal.nominal.toString().includes(this.filter.nominal),
            )
          }

          // Цена
          if (this.filter.price) {
            res = res.filter(
              item =>
                item.nominal.selling_price &&
                item.nominal.selling_price.toString().includes(this.filter.price),
            )
          }

          // Статус
          if (this.filter.status) {
            res = res.filter(item => item.status == this.filter.status)
          }

          // Метод оплаты
          if (this.filter.payment_method) {
            res = res.filter(
              item =>
                item.order &&
                this.paymentMethodEnum.get(this.getOrderPaymentMethod(item.order))
                  .id == this.filter.payment_method,
            )
          }

          // Статус оплаты
          if (this.filter.payment_status) {
            res = res.filter(
              item => item.payment_status == this.filter.payment_status,
            )
          }

          // Статус оплаты партнеру
          if (this.filter.merchant_order_status) {
            res = res.filter(
              item =>
                item.merchant_order_status == this.filter.merchant_order_status,
            )
          }

          // Дата оплаты
          if (this.filter.paid_at_range.length) {
            res = res
              .filter(item => !!item.paid_at)
              .filter(
                item =>
                  item.paid_at &&
                  this.$moment.utc(item.paid_at) >=
                  this.$moment(this.filter.paid_at_range[0]) &&
                  this.$moment.utc(item.paid_at) <=
                  this.$moment(this.filter.paid_at_range[1]),
              )
          }

          // Дата выпуска
          if (this.filter.date_issued_range.length) {
            res = res
              .filter(item => !!item.date_issued)
              .filter(
                item =>
                  item.date_issued &&
                  this.$moment.utc(item.date_issued) >=
                  this.$moment(this.filter.date_issued_range[0]) &&
                  this.$moment.utc(item.date_issued) <=
                  this.$moment(this.filter.date_issued_range[1]),
              )
          }

          if (this.filter.expired) {
            res = res
              .filter(item => !!item.expires_at)
              .filter(
                item =>
                  item.expires_at &&
                  this.$MomentUTC
                    .DateTimeFormat(item.expires_at)
                    .includes(this.filter.expired),
              )
          }

          // Дата использования
          if (this.filter.used_at_range.length) {
            res = res
              .filter(item => !!item.used_at)
              .filter(
                item =>
                  item.used_at &&
                  this.$moment.utc(item.used_at) >=
                  this.$moment(this.filter.used_at_range[0]) &&
                  this.$moment.utc(item.used_at) <=
                  this.$moment(this.filter.used_at_range[1]),
              )
          }
        }

        return res
      },
    },
    watch: {
      page (newPage) {
        this.loadData()
      },
      perPage (val) {
        this.loadData()
      },
    },
    mounted () {
      this.loadData()
      const filterKey = this.$route.path + ':filter'
      if (localStorage.getItem(filterKey)) {
        try {
          this.filter = JSON.parse(localStorage.getItem(filterKey))
        } catch (e) {
          localStorage.removeItem(filterKey)
        }
      }
    },
    methods: {
      statusIcon (status) {
        if (status === 'wait_payment') {
          status = 'wait'
        }
        return require('@/icons/svg/' + status + '.svg')
      },
      merchantOrderStatusIcon (status) {
        switch (status) {
          case 'not_required': status = 'dont_needed'; break
          case 'succeded': status = 'paid'; break
        }
        return require('@/icons/svg/payments/' + status + '.svg')
      },
      paymentStatusIcon (status) {
        switch (status) {
          case 'SBERBANK': status = 'card'; break
          case 'PLUS_CASH': status = 'cashier'; break
          default: status = 'another'
        }

        return require('@/icons/svg/' + status + '.svg')
      },
      loadData () {
        this.loadingList = true
        this.$store
          .dispatch('certificate/list', {
            // merchant_id: this.merchant.id,
            merchant_id: 23, // TARK
            offset: (this.page * this.perPage) - this.perPage,
            limit: this.perPage,
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
