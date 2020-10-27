<template>
  <BaseDrawerDialog
    v-model="dialog"    
  >
    <template v-slot:actions>
      <v-btn
        v-if="detailedCert.archived_at"
        :loading="changeArchiveStatusAction"
        text
        color="neutral-500"
        @click="changeArchiveStatus(false)"
      >
        <v-icon left>
          mdi-archive-arrow-up-outline
        </v-icon> В работу
      </v-btn>
      <v-btn
        v-else
        text
        :loading="changeArchiveStatusAction"
        color="neutral-500"
        @click="changeArchiveStatus(true)"
      >
        <v-icon left>
          mdi-archive-arrow-down-outline
        </v-icon> Архивировать
      </v-btn>
    </template>
    <div class="cert-details-content">
      <div
        v-if="detailedCert.used_at"
        class="cert-details-property d-flex"
      >
        <div class="cert-details-used body-s-semibold">
          Использован {{ $moment(detailedCert.used_at).format('DD.MM.YYYY,\u00A0HH:mm') }}
        </div>
      </div>

      <div
        v-if="detailedCert.certificate"
        class="cert-details-cert-name d-flex"
      >
        <div class="title-m-bold">
          {{ detailedCert.certificate.name }}
        </div>
      </div>

      <div
        v-if="$IsDebugMode()"
        class="cert-details-property d-flex"
      >
        <div class="body-l-semibold">
          Номинал: {{ detailedCert.nominal_name || '-' }}
        </div>
      </div>
      <div
        v-if="detailedCert.nominal"
        class="cert-details-property d-flex"
      >
        <div class="body-l-semibold">
          {{ detailedCert.selling_price }} &#8381
        </div>
      </div>

      <div
        v-if="detailedCert.certificate"
        class="cert-details-block d-flex"
      >
        <div class="body-l-semibold">
          Сертификат
        </div>
      </div>

      <div
        v-if="detailedCert.certificate"
        class="cert-details-property d-flex"
      >
        <div class="cert-details-prop-name body-s-semibold">
          № заказа
        </div>
        <div class="cert-details-prop-value body-m-medium">
          {{ (detailedCert.order && detailedCert.order.num) || '-' }}
        </div>
      </div>

      <div
        v-if="detailedCert.certificate"
        class="cert-details-property d-flex"
      >
        <div class="cert-details-prop-name body-s-semibold">
          ID сертификата
        </div>
        <div class="cert-details-prop-value body-m-medium">
          {{ detailedCert.certificate.id }}
        </div>
      </div>

      <div
        v-if="detailedCert.certificate"
        class="cert-details-property d-flex"
      >
        <div class="cert-details-prop-name body-s-semibold">
          Выпущен
        </div>
        <div
          v-if="detailedCert.issued"
          class="cert-details-prop-value body-m-medium"
        >
          {{ $moment(detailedCert.date_issued).format('DD.MM.YYYY,\u00A0HH:mm') }}
        </div>
        <div
          v-else
          class="cert-details-status-date body-m-medium"
        >
          -
        </div>
      </div>

      <div
        v-if="detailedCert.certificate"
        class="cert-details-property d-flex"
      >
        <div class="cert-details-prop-name body-s-semibold">
          Истекает
        </div>
        <div
          v-if="detailedCert.expires_at"
          class="cert-details-status-date body-s-semibold"
        >
          {{ $moment(detailedCert.expires_at).format('DD.MM.YYYY,\u00A0HH:mm') }}
        </div>
        <div
          v-else
          class="cert-details-status-date body-m-regular"
        >
          -
        </div>
      </div>

      <div
        v-if="detailedCert.certificate"
        class="cert-details-property d-flex"
      >
        <div class="cert-details-prop-name body-s-semibold">
          Статус
        </div>
        <div>
          <v-img
            height="21px"
            width="21px"
            class="cert-details-status-icon"
            :src="statusIcon(detailedCert.status)"
          />
        </div>
        <div class="cert-details-status body-m-semibold">
          <span>{{ statusTooltip(detailedCert.status) }}</span>
        </div>
        <div class="cert-details-status-date body-m-medium">
          <span>{{ statusDate(detailedCert) }}</span>
        </div>
        <v-btn
          v-if="detailedCert.deleted_at != null"
          text
          color="primary"
          :loading="restoreCertAction"
          @click="restoreCertOrder"
        >
          <span class="">Вернуть</span>
        </v-btn>
      </div>

      <div
        v-if="detailedCert.order"
        class="cert-details-property d-flex"
      >
        <div class="cert-details-prop-name body-s-semibold">
          Оплата
        </div>
        <div>
          <v-img
            height="21px"
            width="21px"
            class="cert-details-status-icon"
            :src="paymentStatusIcon(detailedCert.payment_status)"
          />
        </div>
        <div :class="detailedCert.payment_status === 'wait' ? 'cert-details-payment-wait-status body-m-semibold' : 'cert-details-payment-status body-m-semibold'">
          <span>{{ paymentStatusTooltip(detailedCert.payment_status) }}</span>
        </div>
        <div
          v-if="detailedCert.paid_at"
          class="cert-details-status-date body-m-medium"
        >
          <span>{{ this.$moment.utc(detailedCert.paid_at).local().format('DD.MM.YYYY,\u00A0HH:mm') }}</span>
        </div>
      </div>

      <div
        v-if="detailedCert.certificate"
        class="cert-details-property d-flex"
      >
        <div class="cert-details-prop-name body-s-semibold">
          Выплата
        </div>
        <div class="cert-property body-s-semibold">
          <v-img
            height="21px"
            width="21px"
            class="cert-details-status-icon"
            :src="merchantOrderStatusIcon(detailedCert.merchant_order_status)"
          />
        </div>
        <div
          :class="detailedCert.merchant_order_status !== 'not_paid' && detailedCert.merchant_order_status !== 'wait' ? 'cert-details-success-status body-m-semibold' : 'cert-details-status body-m-semibold'"
        >
          <span>{{ merchantOrderStatusTooltip(detailedCert.merchant_order_status) }}</span>
        </div>
      </div>
      <v-row v-if="!detailedCert.deleted_at && detailedCert.issued && !detailedCert.is_expired && !detailedCert.used ">
        <v-col>
          <v-btn
            color="primary"
            @click="usedDialog = true"
          >
            <v-icon left>
              $iconify_ion-checkmark-done
            </v-icon> Отметить как использованный
          </v-btn>
        </v-col>
      </v-row>

      <div class="cert-details-divider">
        <v-divider />
      </div>

      <v-row
        v-if="detailedCert.order"
        no-gutters
      >
        <v-col>
          <div
            class="cert-details-block d-flex"
          >
            <div class="body-l-semibold">
              Оплата
            </div>
          </div>

          <v-row v-if="!detailedCert.paid && !!detailedCert.user_id && !detailedCert.deleted_at">
            <v-col>
              <v-btn
                color="primary"
                @click="paidClick()"
              >
                <v-icon left>
                  $iconify_bx-bx-ruble
                </v-icon> Оплатить сертификат
              </v-btn>
            </v-col>
          </v-row>

          <div
            v-if="detailedCert.certificate && detailedCert.order"
            class="cert-details-property d-flex"
          >
            <div class="cert-details-prop-name body-s-semibold">
              ID
            </div>
            <div class="cert-details-prop-value body-m-medium">
              {{ detailedCert.order.id }}
            </div>
          </div>

          <div
            v-if="detailedCert.order && detailedCert.order.last_paid_payment && detailedCert.order.last_paid_payment.paid_at"
            class="cert-details-property d-flex"
          >
            <div class="cert-details-prop-name body-s-semibold">
              Статус
            </div>
            <div
              style="display: flex; align-items: center;"
              class="cert-details-success-status body-m-medium"
            >
              <v-icon>$iconify_bx-check</v-icon>
              <span>Выполнена</span>
            </div>
            <div class="cert-details-status-date body-m-medium">
              {{ $moment(detailedCert.order.last_paid_payment.paid_at).format('DD.MM.YYYY,\u00A0HH:mm') }}
            </div>
          </div>

          <div
            v-if="detailedCert.order"
            class="cert-details-property d-flex"
          >
            <div class="cert-details-prop-name body-s-semibold">
              Тип
            </div>
            <div
              v-if="detailedCert.order.last_paid_payment"
              class="cert-details-prop-value body-m-medium"
            >
              {{ paymentSystemType(detailedCert.order.last_paid_payment.type) }}
            </div>
            <div
              v-else
              class="cert-details-prop-value body-m-medium"
            >
              -
            </div>
          </div>

          <div
            v-if="detailedCert.order"
            class="cert-details-property d-flex"
          >
            <div class="cert-details-prop-name body-s-semibold">
              Создана
            </div>
            <div
              v-if="detailedCert.order.last_paid_payment"
              class="cert-details-status-date body-m-medium"
            >
              {{ $moment(detailedCert.order.last_paid_payment.created_at).format('DD.MM.YYYY,\u00A0HH:mm') }}
            </div>
            <div
              v-else
              class="cert-details-status-date body-m-medium"
            >
              -
            </div>
          </div>

          <div
            v-if="detailedCert.order && detailedCert.order.last_paid_payment && !detailedCert.order.last_paid_payment.paid_at"
            class="cert-details-property d-flex"
          >
            <div class="cert-details-prop-name body-s-semibold">
              Истекает
            </div>
            <div
              v-if="detailedCert.order.last_paid_payment && detailedCert.order.last_paid_payment.IsExpired"
              class="cert-details-status-date body-m-medium"
            >
              {{ $moment(detailedCert.order.last_paid_payment.expired_at).format('DD.MM.YYYY,\u00A0HH:mm') }}
            </div>
            <div
              v-else
              class="cert-details-status-date body-m-medium"
            >
              -
            </div>
          </div>

          <div
            v-if="detailedCert.order && detailedCert.order.last_paid_payment"
            class="cert-details-property d-flex"
          >
            <div class="cert-details-prop-name body-s-semibold">
              Реквизиты
            </div>
            <div
              class="cert-details-prop-value body-m-medium"
            >
              {{ detailedCert.order.last_paid_payment.transaction_id || '-' }}
            </div>
          </div>
          <div
            v-if="detailedCert.order && detailedCert.order.last_paid_payment && detailedCert.order.last_paid_payment.comment"
            class="cert-details-property d-flex"
          >
            <div class="cert-details-prop-name body-s-semibold">
              Комментарий
            </div>
            <div
              class="cert-details-prop-value body-m-medium"
            >
              {{ detailedCert.order.last_paid_payment.comment || '-' }}
            </div>
          </div>
        </v-col>
      </v-row>

      <certificate-user-block
        v-if="!!detailedCert.user"
        :user="detailedCert.user"
      />
    </div>
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
  </BaseDrawerDialog>
</template>

<script>
  import dialogable from '@/mixins/dialogable.js'
  import CertMethodsMixin from './CertMethodsMixin'
  import CertificatePaidDialog from './CertificatePaidDialog'
  import CertificateUsedDialog from './CertificateUsedDialog'
  import CertificateUserBlock from './CertificateUserBlock'

  export default {
    components: { CertificatePaidDialog, CertificateUserBlock, CertificateUsedDialog },
    mixins: [dialogable, CertMethodsMixin],
    props: {
      detailedCert: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        // detailedCert: null,
        changeArchiveStatusAction: false,
        paidDialog: false,
        usedDialog: false,
      }
    },
    computed: {},
    mounted () {

    },
    methods: {
      changeArchiveStatus (archive) {
        this.changeArchiveStatusAction = true
        this.changeCertArchiveStatus({
          user_certificate_id: this.detailedCert.id,
          archive,
        }).finally(() => {
          this.changeArchiveStatusAction = false
        })
      },
      restoreCertOrder () {
        this.restoreCertAction = true
        this.restoreCert({ id: this.detailedCert.id }).finally(() => {
          this.restoreCertAction = false
        })
      },
      paidClick () {
        this.paidDialog = true
      },
    },
  }
</script>

<style scoped>
</style>
