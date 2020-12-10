const getDefaultState = () => {
    return {
        filter: {
            enable: false,
            certificates: [],
            certPaymentStatus: [],
            certMerchantOrderStatus: [],
            certOrderStatus: [],
            buyers: [],
            archiveStatus: { id: 'work', text: 'в работе' },
        },
        period: {
            id: 1,
            name: 'За сегодня',
            start: new Date(Date.now()).toISOString().split('T')[0],
            end: new Date(Date.now()).toISOString().split('T')[0],
        },
        archiveStatus: { id: 'work', text: 'в работе' },
    }
}

const getDefaultFilter = () => {
    return {
        filter: {
            enable: false,
            certificates: [],
            certPaymentStatus: [],
            certMerchantOrderStatus: [],
            certOrderStatus: [],
            buyers: [],
            archiveStatus: { id: 'work', text: 'в работе' },
        },
        period: { id: 1, name: 'За сегодня', start: new Date(Date.now()).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0] },
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        const defaultState = getDefaultState()
        Object.assign(state, defaultState)
        localStorage.setItem('certificateTableFilter', JSON.stringify(defaultState.filter))
    },
    filter (state, payload) {
        state.filter = payload
        state.filter.archiveStatus = state.archiveStatus
        localStorage.setItem('certificateTableFilter', JSON.stringify(state.filter))
    },
    archiveStatus (state, payload) {
        state.archiveStatus = payload
    },
    period (state, payload) {
        console.log('PERIOD...')
        console.log(payload)
        state.period = payload
        localStorage.setItem('certFilterPeriod', JSON.stringify(payload))
    },
}

const actions = {
    // filter ({ commit }) {
    //     if (localStorage.getItem('certificateTableFilter')) {
    //         const filterLocal = JSON.parse(localStorage.getItem('certificateTableFilter'))
    //         if (filterLocal) {
    //             commit('filter', filterLocal)
    //         }
    //     }
    // },
    async filterPeriod ({ commit }) {
        const startPeriod = localStorage.getItem('startPeriodFilter')
        const endPeriod = localStorage.getItem('endPeriodFilter')
        if (startPeriod) commit('startPeriodFilter', startPeriod)
        if (endPeriod) commit('endPeriodFilter', endPeriod)
    },
}

const getters = {
    startPeriod: (state) => state.startPeriod,
    endPeriod: (state) => state.endPeriod,
    filter: (state) => state.filter,
    filterDefault: () => {
        const defaultFilter = getDefaultFilter()
        return defaultFilter.filter
    },
    period: (state) => state.period,
    archiveStatus: (state) => state.archiveStatus,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
