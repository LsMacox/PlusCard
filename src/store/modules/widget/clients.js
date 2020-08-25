export default {
    namespaced: true,
    state: {
        loading: false,
        widgetData: [],
        clients: []
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
        clients (state, payload) {
            state.clients = payload;
        }
    },
    actions: {

        async widget ({commit}, widget) {
            commit('loading', true)

            const success = await axios.post('/api/widget/clients', widget)
            commit('widgetData', success.data.data)
            commit('loading', false)  
           
        },

        async findClient({commit}, widget) {
            commit('loading', true)

            const success = await APIBackendCabinet.get('/widget/findClient?program_id='+widget.program_id + '&client='+widget.query);
            commit('clients', success.data[0].children)
            commit('loading', false)
        }

    },
    getters: {
        loading (state) {
            return state.loading
        },
        widgetData (state) {
            return state.widgetData
        },
        clients (state) {
            return state.clients
        }
    }
}
