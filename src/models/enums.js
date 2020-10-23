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

export {
    EVENTS_ENUM,
    RESOURCE_TYPE_ENUM,
    MODERATION_STATUS_ENUM,
    CERT_PAYMENT_TYPE_ENUM,
}
