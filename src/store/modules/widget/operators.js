import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        loading: false,
        widgetData: [],
        operators: [],
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
        operators (state, payload) {
            state.operators = payload
        },
    },
    actions: {
        async widget ({ commit }, widget) {
            commit('loading', true)
            const success = await ApiService.post('/api-cabinet/widget/operators', widget)
            console.log(success)
            commit('widgetData', success)
            commit('loading', false)
        },
        async operators ({ commit }, id) {
            commit('loading', true)
            const success = await ApiService.get('/api-cabinet/widget/operatorList?program_id=' + id)
            console.log(success)
            commit('operators', success)
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
        operators (state) {
            return state.operators
        },
    },
}
