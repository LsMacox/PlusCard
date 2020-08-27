export default {
    namespaced: true,
    state: {
        loading: false,
        period: 7,
        widgetData: []
    },
    mutations: {
        clearState (state) {
            state.loading = false
            state.period = 7
            state.widgetData = []
        },
        loading (state, payload) {
            state.loading = payload
        },
        period (state, payload) {
            state.period = payload
        },
        widgetData (state, payload) {
            state.widgetData = payload
        }
    },
    actions: {

        async widget ({commit}, widget) {
            commit('loading', true)
            const success = await axios.post('/api/widget/activebuyers', widget)
            // ////console.log(success)
            commit('widgetData', success.data.data)
            commit('loading', false)               

        }

    },
    getters: {
        loading (state) {
            return state.loading
        },
        period (state) {
            return state.period
        },
        widgetData (state) {
            return state.widgetData
        }
    }
}
