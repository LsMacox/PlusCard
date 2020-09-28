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
            const chartData = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
            const bonusRatio = [0, 0, 0]

            if (state.widgetData.credit) {
                chartData[0] = state.widgetData.credit
            }

            if (state.widgetData.debit) {
                chartData[1] = state.widgetData.debit
            }

            if (state.widgetData.expired) {
                chartData[2] = state.widgetData.expired
            }

            if (state.widgetData.bonus_sum) {
                if (state.widgetData.bonus_sum > 0) {
                    bonusRatio[0] = Math.round(state.widgetData.credit[0] / state.widgetData.bonus_sum * 100)
                    bonusRatio[1] = Math.round(state.widgetData.debit[0] / state.widgetData.bonus_sum * 100)
                    bonusRatio[2] = Math.round(state.widgetData.expired[0] / state.widgetData.bonus_sum * 100)
                }
            }

            console.log('movemsent')
            console.log({
                total: state.widgetData.total,
                dateLabels: state.widgetData.date_labels,
                chart: chartData,
                bonusRatio: bonusRatio,
            })
            console.log('movement')

            return {
                total: state.widgetData.total,
                dateLabels: state.widgetData.date_labels,
                chart: chartData,
                bonusRatio: bonusRatio,
            }
        },
    },
}
