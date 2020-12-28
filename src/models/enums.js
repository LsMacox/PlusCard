const EVENTS_ENUM = Object.freeze({
    AccountFirstEmissionEvent: 'App\\Events\\AccountFirstEmissionEvent',
    AccountBuyEvent: 'App\\Events\\AccountBuyEvent',
    AccountClientBirthDayEvent: 'App\\Events\\Accounts\\AccountClientBirthDayEvent',
})

const RESOURCE_TYPE_ENUM = Object.freeze({
    SOURCE: 'TYPE_SOURCE',
    TARGET: 'TYPE_TARGET',
})

const MODERATION_STATUS_ENUM = Object.freeze({
    pending: {
        id: 'pending',
        name: 'На модерации',
        color: 'warning-500',
        icon: require('@/icons/svg/payments/wait.svg'),
    },
    approved: {
        id: 'approved',
        name: 'Принято',
        color: 'success-500',
        icon: require('@/icons/svg/payments/succeded.svg'),
    },
    partial: {
        id: 'partial',
        name: 'Частично принято',
        color: 'success-500',
        icon: require('@/icons/svg/payments/succeded.svg'),
    },
    rejected: {
        id: 'rejected',
        name: 'Отклонено',
        color: 'error-500',
        icon: require('@/icons/svg/payments/not_paid.svg'),
    },
    default: {
        id: '',
        name: '-',
        color: 'error-500',
        icon: require('@/icons/svg/payments/not_paid.svg'),
    },
    find (id) { return this[id] || this.default },

})

const CERT_PAYMENT_TYPE_ENUM = Object.freeze({
    PLUS_CASH: { id: 'PLUS_CASH', text: 'Касса (наличные, карта)' },
    PLUS_OTHER: { id: 'PLUS_OTHER', text: 'Другой способ' },
})

const BALANCE_OPERATION_TYPE_ENUM = Object.freeze({
    default: { id: '', text: '-', color: 'error-500', icon: null },
    debit: { id: 'debit', text: 'Списание за услуги', color: 'error-500', icon: '$icons_status-error' },
    credit: { id: 'credit', text: 'Пополнение баланса', color: 'success-500', icon: '$icons_status-success' },
    find (id) { return this[id] || this.default },
})

const MERCHANT_ORDER_STATUS_ENUM = Object.freeze({
    default: { id: '', text: '-', color: 'error-500', icon: null },
    pending: { id: 'pending', text: 'Не оплачен', color: 'error-500', icon: '$icons_status-error' },
    waiting: { id: 'waiting', text: 'В ожидании', color: 'warning-500', icon: '$icons_status-wait' },
    succeded: { id: 'succeded', text: 'Оплачен', color: 'success-500', icon: '$icons_status-success' },
    canceled: { id: 'canceled', text: 'Отменен', color: 'neutral-500', icon: '$icons_status-cancel' },
    find (id) { return this[id] || this.default },
})

const MERCHANT_ORDER_METHOD = Object.freeze({
    METHOD_SBERBANK: 'sberbank',
    METHOD_ORDER_ORG: 'org',
})

const MERCHANT_ORDER_METHOD_ENUM = Object.freeze({
    default: { value: '', text: '-', },
    sberbank: { value: 'sberbank', text: 'Онлайн' },
    org: { value: 'org', text: 'Счет' },    
    find (id) { return this[id] || this.default },
})

export {
    EVENTS_ENUM,
    RESOURCE_TYPE_ENUM,
    MODERATION_STATUS_ENUM,
    CERT_PAYMENT_TYPE_ENUM,
    BALANCE_OPERATION_TYPE_ENUM,
    MERCHANT_ORDER_STATUS_ENUM,
    MERCHANT_ORDER_METHOD,
    MERCHANT_ORDER_METHOD_ENUM,
}
