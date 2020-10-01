import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        loading: false,
        tableData: [],
        totalCount: 0,
    },
    mutations: {
        clearState (state) {
            state.loading = false
            state.tableData = []
        },
        loading (state, payload) {
            state.loading = payload
        },
        tableData (state, payload) {
            state.tableData = payload
        },
        totalCount (state, payload) {
            state.totalCount = payload
        },
    },
    actions: {
        async table ({ commit }, table) {
            commit('loading', true)

            const result = await ApiService.post('/api-cabinet/program/sales2', table)
            console.log('table data.......')
            console.log(result)
            console.log('table data.......')
            commit('tableData', result.table)
            commit('totalCount', result.total_count)
            commit('loading', false)
        },

    },
    getters: {
        loading (state) {
            return state.loading
        },
        tableData (state) {
            return state.tableData
        },
        totalCount (state) {
            return state.totalCount
        },
    },
}
