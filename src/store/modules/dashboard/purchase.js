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

            const result = await ApiService.post('/api-cabinet/widget/dashboard/purchases', widget)
            commit('widgetData', result)
            commit('loading', false)
        },

    },
    getters: {
        loading (state) {
            return state.loading
        },
        widgetData (state) {
            const chartData = [[], []]

            console.log('dafadasd')
            console.log(state.widgetData)
            console.log('dafadasd')

            if (state.widgetData.chart && state.widgetData.chart.by_program) {
                state.widgetData.chart.by_program.forEach(item => {
                    chartData[0].push(item.sum)
                })
            }
            if (state.widgetData.chart && state.widgetData.chart.total) {
                state.widgetData.chart.total.forEach(item => {
                    chartData[1].push(item.sum)
                })
            }
            return {
                chart: chartData,
                totalCount: state.widgetData.total_count,
                byProgramCount: state.widgetData.by_program_count,
                totalSum: state.widgetData.total_sum_current / 100,
                byProgramSum: state.widgetData.by_program_sum_current / 100,
                totalSumPrev: state.widgetData.total_sum_prev,
                byProgramSumPrev: state.widgetData.by_program_sum_prev,
            }
        },
    },
}
