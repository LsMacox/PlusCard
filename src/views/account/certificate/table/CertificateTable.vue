<template>
  <div>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="filtered_certificates"
          :single-expand="true"
          :options.sync="tableSettings"
          :expanded.sync="expanded"
          :item-class="() => 'clickable-row'"
          item-key="id"
          :show-expand="false"
          class="plus-table"
          hide-default-footer
          :server-items-length="totalCount"
          @click:row="details"
          @update:sort-by="fetchData()"
          @update:sort-desc="fetchData()"
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              More info about {{ item.id }}
            </td>
          </template>

          <template v-slot:[`item.data-table-expand`]="{ expand, isExpanded }">
            <span
              class="iconify"
              data-icon="bi:chevron-right"
              data-inline="false"
              @click="expand(!isExpanded)"
            />
          </template>

          <template v-slot:[`item.certificate.name`]="{ item }">
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

          <template v-slot:[`item.user.UserName`]="{ item }">
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
                Был(а) в сети {{ $moment.utc(item.user.last_activity).local().format('DD.MM.YYYY\u00A0HH:mm') }}
              </div>
            </div>
          </template>

          <template v-slot:[`item.nominal.selling_price`]="{ item }">
            <span style="float: right">
              {{ formatNum(item.nominal.selling_price) }} &#8381;
            </span>
          </template>

          <template v-slot:[`item.payment_status`]="{ item }">
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
              <span>{{ paymentStatusTooltip(item.payment_status, item.status) }}</span>
            </v-tooltip>
          </template>

          <template v-slot:[`item.status`]="{ item }">
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

          <template v-slot:[`item.merchant_order_status`]="{ item }">
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

          <template v-slot:[`item.date_issued`]="{ item }">
            <date-column :value="item.date_issued" />
          </template>

          <template v-slot:[`item.created_at`]="{ item }">
            <date-column :value="item.created_at" />
          </template>

          <template v-slot:[`item.used_at`]="{ item }">
            <date-column :value="item.used_at" />
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  :loading="item.loading"
                  v-on="on"
                >
                  <v-icon>$iconify_feather-more-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item
                  v-for="(menuItem, index) in getCertActions(item)"
                  :key="index"
                  @click="menuItem.action(item)"
                >
                  <v-list-item-icon>
                    <v-icon color="neutral-500">
                      {{ menuItem.icon }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title
                    :class=" {
                      'body-s-medium' : true,
                      'neutral-500--text':true,
                    }"
                  >
                    {{ menuItem.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
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
            :model.sync="tableSettings.itemsPerPage"
            item-value="value"
            item-label="text"
          />

          <div class="app__spacer" />

          <div class="text-center">
            <v-pagination
              v-model="tableSettings.page"
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
    <certificate-paid-dialog
      v-if="paidDialog"
      v-model="paidDialog"
      :cert="detailedCert"
    />
    <certificate-used-dialog
      v-if="usedDialog"
      v-model="usedDialog"
      :cert="detailedCert"
    />
    <certificate-continue-dialog
      v-if="continueDialog"
      v-model="continueDialog"
      :cert="detailedCert"
    />
  </div>
</template>

<script>
  import SelectPageLimit from '@/components/dialogs/SelectPageLimit'
  import CertificateForm from '../CertificateForm'
  import CertificatePaidDialog from '../CertificatePaidDialog'
  import CertificateUsedDialog from '../CertificateUsedDialog'
  import CertificateContinueDialog from '../CertificateContinueDialog'
  import CertMethodsMixin from '../CertMethodsMixin'
  import DataTableMixin from '@/mixins/dataTable'
  import Permission from '@/mixins/permission'
  import Vue from 'vue'

  export default {
    name: 'Certificates',
    components: {
      DateColumn: () => import('@/components/colums/DateColumn.vue'),
      SelectPageLimit,
      CertificateForm,
      CertificatePaidDialog,
      CertificateUsedDialog,
      CertificateContinueDialog,
    },
    mixins: [CertMethodsMixin, Permission, DataTableMixin],
    data () {
      return {
        showDetails: false,
        detailedCert: {},
        paidDialog: false,
        usedDialog: false,
        continueDialog: false,
        filterDrawer: false,
        tableKey: 'UserCertificatesTable',
        wordPages: ['странице', 'страницах', 'страницах'],
        wordOperations: ['сертификат', 'сертификаты', 'сертификатов'],
        expanded: [],
        headers: [
          {
            text: 'Сертификат',
            align: 'start',
            value: 'certificate.name',
            sortable: false,
          },
          {
            text: 'Цена',
            value: 'nominal.selling_price',
            align: 'end',
            width: '10em',
            sortable: false,
          },
          {
            text: 'Покупатель',
            value: 'user.UserName',
            sortable: false,
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
            text: 'Создан',
            value: 'created_at',
            width: '10em',
          },
          {
            text: 'Выпущен',
            value: 'date_issued',
            width: '10em',
          },
          {
            text: 'Использован',
            value: 'used_at',
            width: '12em',
          },
          // {
          //   text: '',
          //   value: 'data-table-expand',
          //   width: '1em',
          // },
          {
            text: '',
            value: 'actions',
            width: '1em',
            sortable: false,
          },
        ],

      }
    },
    computed: {
      pagesCount () {
        const count = Math.ceil(this.totalCount / this.tableSettings.itemsPerPage)
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
        return this.$store.getters[
          'account/certificate/certificate/certificates'
        ].map(x => {
          Vue.set(x, 'loading', false)
          return x
        })
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
      period () {
        return this.$store.getters['widget/filter/period']
      },
    },
    watch: {
      tableSettings: {
        handler (v) {
          this.setDataTableSetting(this.tableKey, v)
        },
        deep: true,
      },
      'tableSettings.page' (v) {
        console.log(this.tableSettings)
        if (v) this.fetchData()
      },
      'tableSettings.itemsPerPage' (v) {
        console.log(this.tableSettings)
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
      period (v) {
        if (v) this.fetchData()
      },
    },
    created () {
      // переопределяем настройки таблицы по-умолчанию
      this.tableSettings.multiSort = true
      this.tableSettings = this.getDataTableSetting(this.tableKey, this.tableSettings)
      this.fetchData()
    },
    methods: {
      getCertActions (cert) {
        return [
          {
            icon: '$iconify_ion-document-outline',
            title: 'Подробнее',
            action: this.details,
            show: true,
          },
          {
            icon: '$iconify_bx-bx-ruble',
            title: 'Оплатить',
            action: this.paidClick,
            show: cert.user_id && !cert.deleted_at && !cert.paid && this.hasProgramPermission('program-certificate-user-paid', cert.certificate.program_id),

          },
          {
            icon: '$icons_cert-continue',
            title: 'Продлить',
            action: this.continueCertClick,
            show: cert.user_id && !cert.deleted_at && cert.issued && cert.is_expired && this.hasProgramPermission('program-certificate-user-continue', cert.certificate.program_id),
          },
          {
            icon: '$iconify_ion-checkmark-done',
            title: 'Отметить как использованный',
            action: this.usedDialogClick,
            show: !cert.deleted_at && cert.issued && !cert.is_expired && !cert.used && this.hasProgramPermission('program-certificate-user-use', cert.certificate.program_id),
          },
          {
            icon: 'mdi-archive-arrow-down-outline',
            title: 'Архивировать',
            action: (cert) => this.changeArchiveStatus(cert, true),
            show: cert.user_id && !cert.archived_at && this.hasProgramPermission('program-certificate-user-archive', cert.certificate.program_id),
          },
          {
            icon: 'mdi-archive-arrow-up-outline',
            title: 'В работу',
            action: (cert) => this.changeArchiveStatus(cert, false),
            show: cert.user_id && cert.archived_at && this.hasProgramPermission('program-certificate-user-archive', cert.certificate.program_id),
          },
          {
            icon: '$icons_trash-arrow',
            title: 'Восстановить',
            action: (cert) => this.restoreCertOrder(cert),
            show: !!cert.deleted_at && this.hasProgramPermission('program-certificate-user-restore', cert.certificate.program_id),
          },
          {
            icon: '$iconify_feather-trash',
            title: 'Удалить',
            action: (cert) => this.deleteCertOrderClick(cert),
            show: !cert.deleted_at && cert.issued && cert.is_expired && this.hasProgramPermission('program-certificate-user-delete', cert.certificate.program_id),
          },
        ].filter(x => x.show)
      },

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
      usedDialogClick (item) {
        this.detailedCert = item
        this.usedDialog = true
      },
      paidClick (item) {
        this.detailedCert = item
        this.paidDialog = true
      },
      continueCertClick (item) {
        this.detailedCert = item
        this.continueDialog = true
      },
      details (item) {
        console.log(item)
        this.detailedCert = item
        this.showDetails = true
      },
      changeArchiveStatus (cert, archive) {
        cert.loading = true
        this.changeCertArchiveStatus({
          user_certificate_id: cert.id,
          archive,
        }).finally(() => {
          cert.loading = false
        })
      },
      restoreCertOrder (cert) {
        cert.loading = true
        this.restoreCert({ id: cert.id }).finally(() => {
          cert.loading = false
        })
      },
      deleteCertOrderClick (cert) {
        cert.loading = true
        this.deleteCertOrder(cert).finally(() => {
          cert.loading = false
        })
      },
      formatNum (num) {
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
            start_period: this.period.start,
            end_period: this.period.end,
            filter: this.filter,
            offset: this.getOffset(this.tableSettings.page, this.tableSettings.itemsPerPage),
            limit: this.tableSettings.itemsPerPage,
            sortable: this.getSortable(this.tableSettings.sortBy, this.tableSettings.sortDesc),
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
