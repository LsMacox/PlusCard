export default {
    namespaced: true,
    state: {
        startPeriod: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        endPeriod: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        filter: { enable: false, pbr: [], bu: [], client: '', operator: [] },
        // startPeriodFilter: localStorage.getItem('startPeriodFilter') ? localStorage.getItem('startPeriodFilter') : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        startPeriodFilter: localStorage.getItem('startPeriodFilter') ? localStorage.getItem('startPeriodFilter') : new Date(Date.now() - 7776000000 - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        endPeriodFilter: localStorage.getItem('endPeriodFilter') ? localStorage.getItem('endPeriodFilter') : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
    },
    mutations: {
        startPeriod (state, payload) {
            state.startPeriod = payload
        },
        endPeriod (state, payload) {
            state.endPeriod = payload
        },
        filter (state, payload) {
            // console.log('filter', payload);
            state.filter = payload
            localStorage.setItem('reportFilter', JSON.stringify(state.filter))
        },
        startPeriodFilter (state, payload) {
            state.startPeriodFilter = payload
            localStorage.setItem('startPeriodFilter', payload)
        },
        endPeriodFilter (state, payload) {
            state.endPeriodFilter = payload
            localStorage.setItem('endPeriodFilter', payload)
        },

    },
    actions: {
        filter ({ commit }) {
            if (localStorage.getItem('reportFilter')) {
                const filterLocal = JSON.parse(localStorage.getItem('reportFilter'))
                if (filterLocal) {
                    commit('filter', filterLocal)
                }
            }
        },
        async filterPeriod ({ commit }) {
            console.log('filterPeriod')
            console.log('localFilterStartPeriod', localStorage.getItem('startPeriodFilter'))
            console.log('localFilterEndPeriod', localStorage.getItem('endPeriodFilter'))
            const startPeriod = localStorage.getItem('startPeriodFilter')
            const endPeriod = localStorage.getItem('endPeriodFilter')
            if (startPeriod) commit('startPeriodFilter', startPeriod)
            if (endPeriod) commit('endPeriodFilter', endPeriod)
        },
    },
    getters: {
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
    },
}
