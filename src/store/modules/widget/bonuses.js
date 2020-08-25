import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        loading: false,
        widgetData: [],
        units: [],
        bonus_resources: [],
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
        units (state, payload) {
           // console.log('units_payload', payload);
            state.units = payload
        },
        bonus_resources (state, payload) {
            state.bonus_resources = payload
        },
    },
    actions: {

        async widget ({ commit }, widget) {
            commit('loading', true)

            const success = await ApiService.post('/api-cabinet/widget/bonuses', widget)
            const result = await ApiService.post('/api-cabinet/widget/units', widget)
            const bonusResources = await ApiService.post('/api-cabinet/widget/resources', widget)

            commit('widgetData', success)
            commit('units', result)
            commit('bonus_resources', bonusResources)
            commit('loading', false)
        },

    },
    getters: {
        loading (state) {
            return state.loading
        },
        widgetData (state) {
            return state.widgetData
        },
        units (state) {
            return state.units
        },
        bonus_resources (state) {
            return state.bonus_resources
        },
    },
}
