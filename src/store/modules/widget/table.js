import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        widgetData: [],
        count: 0,
    },
    mutations: {
        clearState (state) {
            state.widgetData = []
            state.count = 0
        },
        widgetData (state, payload) {
            state.widgetData = payload
        },
        count (state, payload) {
            state.count = payload
        },
    },
    actions: {

        async widget ({ commit }, item) {
            const success = await ApiService.post('/api-cabinet/widget/table/page', item)
            // console.log('/api-cabinet/widget/table/page')
            // console.log(success)
            commit('widgetData', success.models)
            commit('count', success.count)
        },

    },
    getters: {
        widgetData (state) {
            return state.widgetData
        },
        count (state) {
            return state.count
        },
    },
}
