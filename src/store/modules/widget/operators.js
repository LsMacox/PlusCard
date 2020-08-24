import ApiService from '@/api/api-client'

const state = {
    loading: false,
    widgetData: [],
    operators: [],
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
    operators (state, payload) {
        state.operators = payload
    },
}

const actions = {

    async widget ({ commit }, widget) {
        commit('loading', true)

        const success = await ApiService.post('/api-cabinet/widget/operators', widget)
        // console.log(success.data.data);
        commit('widgetData', success.data.data)
        commit('loading', false)

    },

    async operators ({ commit }, program_id) {
        commit('loading', true)

        const success = await ApiService.get('/api-cabinet/widget/operatorList?program_id=' + program_id)
        // console.log(success.data.data);
        commit('operators', success.data.data)
        commit('loading', false)
    },

}

const getters = {
    loading (state) {
        return state.loading
    },
    widgetData (state) {
        return state.widgetData
    },
    operators (state) {
        return state.operators
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
