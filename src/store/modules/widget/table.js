import ApiService from '@/api/api-client'

const state = {
    loading: false,
    widgetData: [],
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
}

const actions = {

    async widget ({ commit }, widget) {
        commit('loading', true)

        const success = await ApiService.post('/api-cabinet/widget/table', widget)
        // console.log(success.data.data);
        commit('widgetData', success.data.data)
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
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
