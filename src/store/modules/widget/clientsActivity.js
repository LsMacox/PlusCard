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

        async LoadWidgetData ({ commit }, widget) {
                const success = await axios.post('/api/widget/clients/activity', widget)
                commit('widgetData', success.data.data)
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
