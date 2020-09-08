import ApiService from '@/api/api-client'

const state = {
    loading: false,
    buyers: [],
}

const mutations = {
    clearState (state) {
        state.loading = false
        state.widgetData = []
    },
    loading (state, payload) {
        state.loading = payload
    },
    buyers (state, payload) {
        state.buyers = payload
    },
}

const actions = {
    async buyers ({ commit }, programId) {
        // eslint-disable-next-line no-useless-catch
        try {
            console.log('buyers...')
            commit('loading', true)
            const success = await ApiService.get('/api-cabinet/client/certificate/clients', {
                params: {
                    program_id: programId,
                },
            })

            commit('buyers', success)
            commit('loading', false)
        } catch (error) {
            throw error
        }
    },
}

const getters = {
    loading (state) {
        return state.loading
    },
    buyers (state) {
        return state.buyers
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
