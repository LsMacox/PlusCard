const getDefaultState = () => {
    return {
        filter: {
            enable: false,
            certificates: [],
            issueDate: {
                startDate: null,
                endDate: null,
            },
            certPaymentStatus: [],
            certMerchantOrderStatus: [],
            certOrderStatus: [],
            buyers: [],
            archived_at: null,
        },
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        const defaultState = getDefaultState()
        Object.assign(state, defaultState)
        localStorage.setItem('certificateTableFilter', JSON.stringify(defaultState.filter))
    },
    period (state, payload) {
        state.period = payload
        localStorage.setItem('certificateTableFilterPeriod', JSON.stringify(payload))
    },
    filter (state, payload) {
        state.filter = payload
        localStorage.setItem('certificateTableFilter', JSON.stringify(state.filter))
    },
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
