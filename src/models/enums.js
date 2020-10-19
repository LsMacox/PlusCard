const EVENTS_ENUM = Object.freeze({
    AccountFirstEmissionEvent: 'App\\Events\\AccountFirstEmissionEvent',
    AccountBuyEvent: 'App\\Events\\AccountBuyEvent',
    AccountClientBirthDayEvent: 'App\\Events\\Accounts\\AccountClientBirthDayEvent',
})

const RESOURCE_TYPE_ENUM = Object.freeze({
    SOURCE: 'TYPE_SOURCE',
    TARGET: 'TYPE_TARGET',   
})

export { 
    EVENTS_ENUM,
    RESOURCE_TYPE_ENUM
}
