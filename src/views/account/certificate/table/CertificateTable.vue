<template>
  <div>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="filtered_certificates"
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
                {{ item.certificate.name }}, {{ item.nominal_name || '-' }}
              </div>
              <div
                v-if="item.order"
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
                <v-img
                  class="status-icon"
                  align="center"
                  height="21"
                  width="21"
                  v-bind="attrs"
                  :src="paymentStatusIcon(item.payment_status)"
                  v-on="on"
                />
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
                  :src="statusIcon(item.status)"
                  v-on="on"
                />
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
                  :src="merchantOrderStatusIcon(item.merchant_order_status)"
                  v-on="on"
                />
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
      </v-col>
    </v-row>
    <v-row
      align="center"
      class="pagination"
    >
      <v-col>
        <div class="table-pagination-block">
          <div
            style="margin-right: 20px;"
          >
            Всего {{ totalCount }} {{ getWord(totalCount, wordOperations) }} на {{ pagesCount }} {{ getWord(pagesCount, wordPages) }}
          </div>

          <select-page-limit
            min-width="200px"
            :items="paginationOptions"
            :model.sync="tableOptions.itemsPerPage"
            item-value="value"
            item-label="text"
          />

          <div class="app__spacer" />

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
        </div>
      </v-col>
    </v-row>

    <certificate-form
      v-model="showDetails"
      :detailed-cert="detailedCert"
    />
  </div>
</template>

<script>
  import SelectPageLimit from '@/components/dialogs/SelectPageLimit'
  import CertificateForm from '../CertificateForm'
  import CertMethodsMixin from '../CertMethodsMixin'

  export default {
    name: 'Certificates',
    components: {
      SelectPageLimit, CertificateForm,
    },
    mixins: [CertMethodsMixin],
    data () {
      return {
        showDetails: false,
        detailedCert: {},
        filterDrawer: false,
        tableOptions: {
          page: 1,
          itemsPerPage: 25,
        },
        paginationOptions: [
          { text: '25 на странице', value: 25 },
          { text: '50 на странице', value: 50 },
          { text: '100 на странице', value: 100 },
          { text: '150 на странице', value: 150 },
          { text: '250 на странице', value: 250 },
          { text: '500 на странице', value: 500 },
        ],
        wordPages: ['странице', 'страницах', 'страницах'],
        wordOperations: ['сертификат', 'сертификаты', 'сертификатов'],
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
            width: '10em',
          },
          {
            text: 'Покупатель',
            value: 'user.UserName',
          },
          {
            text: 'Оплата',
            value: 'payment_status',
            align: 'center',
            width: '1em',
            sortable: false,
          },
          {
            text: 'Статус',
            value: 'status',
            align: 'center',
            width: '1em',
            sortable: false,
          },
          {
            text: 'Выплата',
            value: 'merchant_order_status',
            align: 'center',
            width: '1em',
            sortable: false,
          },
          {
            text: 'Дата создания',
            value: 'created_at',
            width: '13em',
          },
          {
            text: 'Выпущен',
            value: 'date_issued',
            width: '13em',
          },
          {
            text: 'Использован',
            value: 'used_at',
            width: '13em',
          },
          {
            text: '',
            value: 'data-table-expand',
            width: '1em',
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
        console.log(
          this.$store.getters['account/certificate/certificate/certificates'],
        )
        return this.$store.getters[
          'account/certificate/certificate/certificates'
        ]
      },
      filtered_certificates () {
        return this.certificates.filter(x => (this.filter.archiveStatus.id === 'archive') ? !!x.archived_at : x.archived_at === null)
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
          this.$store.dispatch(
            'account/certificate/certificate/programCertificates',
            v.id,
          )
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
      getWord (number, words) {
        const cases = [2, 0, 1, 1, 1, 2]
        return words[
          number % 100 > 4 && number % 100 < 20
            ? 2
            : cases[number % 10 < 5 ? number % 10 : 5]
        ]
      },
      closeCertDetails () {
        this.showDetails = false
      },
      details (item) {
        console.log(item)
        this.detailedCert = item
        this.showDetails = true
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

      fetchData () {
        this.loadingList = true
        this.$store
          .dispatch('account/certificate/certificate/list', {
            program_id: this.program.id,
            filter: this.filter,
            offset:
              this.tableOptions.page * this.tableOptions.itemsPerPage -
              this.tableOptions.itemsPerPage,
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

.table-pagination-block {
  margin-left: 22px;
  margin-top: -30px;
  display: flex;
  align-items: center;

  .table-pagination-block-select {
    position: relative;
    top: 6px;
    left: 20px;
    width: 250px;
  }
}

.status-icon {
  margin-left: 40% !important;
}
</style>
