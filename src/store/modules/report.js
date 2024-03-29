// import feed from './feed'
import clients from './widget/clients'
// import clientsActivity from './clientsActivity'
// import activeBuyers from './activeBuyers'
// import makePurchases from './makePurchases'
// import buyers from './buyers'
// import totals from './totals'
import operations from './widget/operations'
import operators from './widget/operators'
import bonuses from './widget/bonuses'
import table from './widget/table'
import bonusClients from './widget/bonusClients'

const state = {
    // startPeriod: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
    // endPeriod: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
    startPeriod: new Date('2020-01-01'),
    endPeriod: new Date('2020-08-15'),
    filter: {
        enable: false,
        pbr: [],
        bu: [],
        client: '',
        operator: [],
    },
    startPeriodFilter: localStorage.getItem('startPeriodFilter') ? localStorage.getItem('startPeriodFilter') : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
    endPeriodFilter: localStorage.getItem('endPeriodFilter') ? localStorage.getItem('endPeriodFilter') : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
}

const mutations = {
    startPeriod (state, payload) {
        state.startPeriod = payload
    },
    endPeriod (state, payload) {
        state.endPeriod = payload
    },
    filter (state, payload) {
        // console.log('filter', payload);
        state.filter = payload
        localStorage.setItem('loyaltyFilter', JSON.stringify(state.filter))
    },
    startPeriodFilter (state, payload) {
        state.startPeriodFilter = payload
        localStorage.setItem('startPeriodFilter', payload)
    },
    endPeriodFilter (state, payload) {
        state.endPeriodFilter = payload
        localStorage.setItem('endPeriodFilter', payload)
    },

}

const actions = {
    filter ({ commit }) {
        if (localStorage.getItem('loyaltyFilter')) {
            const filterLocal = JSON.parse(localStorage.getItem('loyaltyFilter'))
            if (filterLocal) {
                commit('filter', filterLocal)
            }
        }
    },
    async loyaltyFilterPeriod ({ commit }) {
        // console.log('loyaltyFilterPeriod')
        // console.log('localFilterStartPeriod', localStorage.getItem('startPeriodFilter'))
        // console.log('localFilterEndPeriod', localStorage.getItem('endPeriodFilter'))
        const startPeriod = localStorage.getItem('startPeriodFilter')
        const endPeriod = localStorage.getItem('endPeriodFilter')
        if (startPeriod) commit('startPeriodFilter', startPeriod)
        if (endPeriod) commit('endPeriodFilter', endPeriod)
    },
}

const getters = {
    startPeriod (state) {
        return state.startPeriod
    },
    endPeriod (state) {
        return state.endPeriod
    },
    filter (state) {
        return state.filter
    },
    startPeriodFilter (state) {
        return state.startPeriodFilter
    },
    endPeriodFilter (state) {
        return state.endPeriodFilter
    },
}

export default {
    namespaced: true,
    modules: {
        // feed,
        clients,
        // clientsActivity,
        // activeBuyers,
        // makePurchases,
        // buyers,
        // totals,
        operations,
        operators,
        bonuses,
        table,
        bonusClients,
    },
    state,
    mutations,
    actions,
    getters,
}
