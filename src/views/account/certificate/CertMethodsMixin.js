import { mapGetters, mapActions } from 'vuex' 

export default {
    name: 'CertStatusMixin',
    methods: {
        ...mapActions({
            changeCertArchiveStatus: 'account/certificate/certificate/changeArchiveStatus',
            restoreCert: 'account/certificate/certificate/Restore',
        }),
        statusDate (item) {
            let date
            switch (item.status) {
                case 'deleted':
                    date = this.$moment(item.deleted_at).format(
                        'DD.MM.YYYY,\u00A0HH:mm',
                    )
                    break
                case 'paid':
                    date = this.$moment(item.paid_at).format(
                        'DD.MM.YYYY,\u00A0HH:mm',
                    )
                    break
                case 'wait_payment':
                    date = ''
                    break
                case 'used':
                    date = this.$moment(item.used_at).format(
                        'DD.MM.YYYY,\u00A0HH:mm',
                    )
                    break
                case 'new':
                    date = this.$moment(item.date_issued).format(
                        'DD.MM.YYYY,\u00A0HH:mm',
                    )
                    break
                case 'issued':
                    date = this.$moment(item.date_issued).format(
                        'DD.MM.YYYY,\u00A0HH:mm',
                    )
                    break
            }
            return date
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
        paymentSystemType (type) {
            let result = ''
            switch (type) {
                case 'SBERBANK':
                    result = 'Сбербанк'
                    break
                case 'PLUS_CASH':
                    result = 'Оплачено на кассе'
                    break
                default:
                    result = ''
                    break
            }
            return result
        },

      
    },
}
