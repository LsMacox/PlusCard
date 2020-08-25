import ApiService from '@/api/api-client'

const state = {
    loading: false,
    widgetData: [],
    clients: [],
}

const mutations = {
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
        state.clients = payload
    },
}

const actions = {

    async widget ({ commit }, widget) {
        commit('loading', true)

        const success = await ApiService.post('/api/widget/clients', widget)
        commit('widgetData', success.data.data)
        commit('loading', false)
    },
    async findClient ({ commit }, widget) {
        commit('loading', true)

        const success = await ApiService.get('/api-cabinet/widget/findClient?program_id=' + widget.program_id + '&client=' + widget.query)
        commit('clients', success.data[0].children)
        commit('loading', false)
    },

}

const getters = {
    loading (state) {
        return state.loading
    },
    widgetData
        (state) {
        return state.widgetData
    },
    clients (state) {
        return state.clients
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
