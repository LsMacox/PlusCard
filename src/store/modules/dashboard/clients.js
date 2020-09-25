import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        loading: false,
        widgetData: [],
    },
    mutations: {
        clearState (state) {
            state.loading = false
            state.widgetData = []
        },
        loading (state, payload) {
            state.loading = payload
        },
        widgetData (state, payload) {
            state.widgetData = payload
        },
    },
    actions: {
        async widget ({ commit }, widget) {
            commit('loading', true)

            const result = await ApiService.post('/api-cabinet/widget/dashboard/clients/count', widget)
            commit('widgetData', result)
            commit('loading', false)
        },

    },
    getters: {
        loading (state) {
            return state.loading
        },
        widgetData (state) {
            const chartData = [[], []]

            if (state.widgetData.new) {
                state.widgetData.new.forEach(item => {
                    chartData[0].push(item.count)
                })
            }
            if (state.widgetData.total) {
                state.widgetData.total.forEach(item => {
                    chartData[1].push(item.count)
                })
            }
            return chartData
        },
    },
}
