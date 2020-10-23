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
            const newData = []
            const totalData = []

            if (state.widgetData.new) {
                state.widgetData.new.forEach(item => {
                    newData.push({
                        count: item.count,
                        date_start: item.date_start,
                        date_end: item.date_end,
                    })
                })
            }
            if (state.widgetData.total) {
                state.widgetData.total.forEach(item => {
                    totalData.push({
                        count: item.count,
                        date_start: item.date_start,
                        date_end: item.date_end,
                    })
                })
            }
            return [
                newData.reverse(),
                totalData.reverse(),
            ]
        },
    },
}
