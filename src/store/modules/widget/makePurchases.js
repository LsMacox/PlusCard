export default {
    namespaced: true,
    state: {
        loading: false,
        startPeriod: 6,
        endPeriod: 1,
        countsByPeriod: [],
        sumByPeriod: [],
    },
    mutations: {
        clearState (state) {
            state.loading = false
            state.startPeriod = 6
            state.endPeriod = 1
            state.countsByPeriod = []
            state.sumByPeriod = []
        },
        loading (state, payload) {
            state.loading = payload
        },
        startPeriod (state, payload) {
            state.startPeriod = payload
        },
        endPeriod (state, payload) {
            state.endPeriod = payload
        },
        countsByPeriod (state, payload) {
            state.countsByPeriod = payload
        },
        sumByPeriod (state, payload) {
            state.sumByPeriod = payload
        },
    },
    actions: {

        async widget ({ commit }, widget) {
            try {
                commit('loading', true)

                const success = await axios.post('/api/widget/makepurchases', widget)
                /// ///console.log(success)

                commit('countsByPeriod', success.data.counts)
                commit('sumByPeriod', success.data.sum)

                commit('loading', false)
            } catch (error) {
                commit('loading', false)

                throw error
            }
        },

    },
    getters: {
        loading (state) {
            return state.loading
        },
        startPeriod (state) {
            return state.startPeriod
        },
        endPeriod (state) {
            return state.endPeriod
        },
        countsByPeriod (state) {
            return state.countsByPeriod
        },
        sumByPeriod (state) {
            return state.sumByPeriod
        },
    },
}
