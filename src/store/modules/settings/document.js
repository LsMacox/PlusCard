import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        loading: false,
        documents: [],
    },
    mutations: {
        clearState (state) {
            state.loading = false
            state.documents = null
        },
        loading (state, payload) {
            state.loading = payload
        },
        documents (state, payload) {
            state.documents = payload
        },
    },
    actions: {
        async list ({ commit }, id) {
            commit('loading', true)
            const result = await ApiService.get('/api-cabinet/documents/request/filter/' + id)
            commit('documents', result)
            commit('loading', false)
        },

    },
    getters: {
        loading (state) {
            return state.loading
        },
        documents (state) {
            return state.documents
        },
    },
}
