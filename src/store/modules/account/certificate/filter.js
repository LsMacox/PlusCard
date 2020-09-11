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
            archiveStatus: { id: 'work', text: 'в работе' },
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
    filter (state, payload) {
        state.filter = payload
        localStorage.setItem('certificateTableFilter', JSON.stringify(state.filter))
    },
    archiveStatus (state, payload) {
        console.log(payload)
        state.filter.archiveStatus = payload
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
    archiveStatus: (state) => state.filter.archiveStatus,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
