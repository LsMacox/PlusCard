import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        loading: false,
        segments: [],
    },
    mutations: {
        segmentsTransform (state, payload) {
            state.segments = []
            payload.forEach(item => {
                state.segments.push(
                    [
                        {
                            text: item.name,
                            color: item.color,
                        },
                        0,
                        0,
                        0,
                    ],
                )
            })
        },
        loading (state, payload) {
            state.loading = payload
        },
    },
    actions: {
        async segments ({ commit }, payload) {
            commit('loading', true)
            const result = await ApiService.get('/api-cabinet/program/client/segment/list', {
                params: payload,
            })
            commit('segmentsTransform', result)
            commit('loading', false)
        },
    },
    getters: {
        segments (state) {
            return state.segments
        },
    },
}
