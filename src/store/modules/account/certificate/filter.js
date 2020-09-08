const getDefaultState = () => {
    return {
        // issueStart: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        // issueEnd: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        filter: {
            enable: false,
            certificates: [],
            issueDate: {
                // startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
                // endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
                startDate: null,
                endDate: null,
            },
            certPaymentStatus: [],
            certMerchantOrderStatus: [],
            certOrderStatus: [],
            buyers: [],
        },
        // startPeriodFilter: localStorage.getItem('startPeriodFilter') ? localStorage.getItem('startPeriodFilter') : new Date(Date.now() - 7776000000 - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        // endPeriodFilter: localStorage.getItem('endPeriodFilter') ? localStorage.getItem('endPeriodFilter') : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        const defaultState = getDefaultState()
        Object.assign(state, defaultState)
        localStorage.setItem('certificateTableFilter', JSON.stringify(defaultState.filter))
    },
    // startPeriod (state, payload) {
    //     state.startPeriod = payload
    // },
    // endPeriod (state, payload) {
    //     state.endPeriod = payload
    // },
    filter (state, payload) {
        state.filter = payload
        localStorage.setItem('certificateTableFilter', JSON.stringify(state.filter))
    },
    // startPeriodFilter (state, payload) {
    //     state.startPeriodFilter = payload
    //     localStorage.setItem('startPeriodFilter', payload)
    // },
    // endPeriodFilter (state, payload) {
    //     state.endPeriodFilter = payload
    //     localStorage.setItem('endPeriodFilter', payload)
    // },
}

const actions = {
    filter ({ commit }) {
        if (localStorage.getItem('certificateTableFilter')) {
            const filterLocal = JSON.parse(localStorage.getItem('certificateTableFilter'))
            if (filterLocal) {
                commit('filter', filterLocal)
            }
        }
    },
    async filterPeriod ({ commit }) {
        // console.log('filterPeriod')
        // console.log('localFilterStartPeriod', localStorage.getItem('startPeriodFilter'))
        // console.log('localFilterEndPeriod', localStorage.getItem('endPeriodFilter'))
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
        const defaultState = Object.assign({}, getDefaultState())
        return defaultState.filter
    },
    startPeriodFilter: (state) => state.startPeriodFilter,
    endPeriodFilter: (state) => state.endPeriodFilter,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
