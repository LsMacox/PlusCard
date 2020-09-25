import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        loading: false,
        widgetData: [],
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
    },
    actions: {
        async widget ({ commit }, widget) {
            commit('loading', true)

            const result = await ApiService.post('/api-cabinet/widget/dashboard/bonuses/movement', widget)
            commit('widgetData', result)
            commit('loading', false)
        },

    },
    getters: {
        loading (state) {
            return state.loading
        },
        widgetData (state) {
            const chartData = [[], [], []]

            if (state.widgetData.credit) {
                chartData[0] = state.widgetData.credit
            }

            if (state.widgetData.debit) {
                chartData[1] = state.widgetData.debit
            }

            if (state.widgetData.expired) {
                chartData[2] = state.widgetData.expired
            }

            console.log('movement')
            console.log({
                total: state.widgetData.total,
                dateLabels: state.widgetData.dateLabels,
                chart: chartData,
            })
            console.log('movement')

            return {
                total: state.widgetData.total,
                dateLabels: state.widgetData.dateLabels,
                chart: chartData,
            }
        },
        bonusRation (state) {
            if (state.widgetData) {
                return {
                    credit: 0,
                    debit: 0,
                    expired: 0,
                }
            }
        }
    },
}
