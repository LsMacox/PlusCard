import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'CertStatusMixin',
    methods: {

        ...mapActions({
            changeCertArchiveStatus: 'account/certificate/certificate/changeArchiveStatus',
            restoreCert: 'account/certificate/certificate/Restore',
            deleteCertOrder: 'account/certificate/certificate/Delete',
            CertOrderPaid: 'account/certificate/certificate/CertOrderPaid',
            certOrderContinue: 'account/certificate/certificate/Continue',
        }),

        statusDate (item) {
            let date = null
            switch (item.status) {
                case 'deleted':
                    date = item.deleted_at
                    break
                case 'paid':
                    date = item.paid_at
                    break
                case 'wait_payment':
                    date = ''
                    break
                case 'used':
                    date = item.used_at
                    break
                case 'new':
                    date = item.created_at
                    break
                case 'issued':
                    date = item.date_issued
                    break
            }
            return date ? this.$moment.utc(date).local().format(
                'DD.MM.YYYY,\u00A0HH:mm',
            ) : ''
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
        merchantOrderStatusIcon (status) {
            return require('@/icons/svg/payments/' + status + '.svg')
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
        paymentStatusTooltip (paymentStatus, status) {
            switch (paymentStatus) {
                case 'SBERBANK':
                    status = 'Оплачен картой'
                    break
                case 'PLUS_CASH':
                    status = 'Оплачен на кассе'
                    break
                case 'wait':
                    status = status !== 'deleted' ? 'Ожидает оплаты' : 'Не оплачен'
                    break
                default:
                    status = 'Оплачен другим способом'
            }
            return status
        },
        paymentSystemType (type) {
            let result = ''
            switch (type) {
                case 'SBERBANK':
                    result = 'Сбербанк'
                    break
                case 'PLUS_CASH':
                    result = 'Оплачено на кассе'
                    break
                case 'PLUS_OTHER':
                    result = 'Другой способ'
                    break
                default:
                    result = '?'
                    break
            }
            return result
        },

    },
}
