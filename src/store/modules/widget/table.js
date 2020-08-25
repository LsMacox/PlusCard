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
            const success = await ApiService.post('/api-cabinet/widget/table', widget)
            console.log('/api-cabinet/widget/table')
            console.log(success)
            commit('widgetData', success)
            commit('loading', false)
        },

    },
    getters: {
        loading (state) {
            return state.loading
        },
        widgetData (state) {
            return state.widgetData
        },
    },
}
