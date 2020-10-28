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
            const newData = []
            const totalData = []

            console.log('dafadasd')
            console.log(state.widgetData)
            console.log('dafadasd')

            if (state.widgetData.chart && state.widgetData.chart.by_program) {
                state.widgetData.chart.by_program.forEach(item => {
                    newData.push({
                        count: item.sum / 100,
                        date_start: item.date_start,
                        date_end: item.date_end,
                    })
                })
            }
            if (state.widgetData.chart && state.widgetData.chart.total) {
                state.widgetData.chart.total.forEach(item => {
                    totalData.push({
                        count: item.sum / 100,
                        date_start: item.date_start,
                        date_end: item.date_end,
                    })
                })
            }
            console.log('DATA')
            console.log(
                {
                    chart: [newData, totalData],
                    totalCount: state.widgetData.total_count,
                    byProgramCount: state.widgetData.by_program_count,
                    totalSum: state.widgetData.total_sum_current / 100,
                    byProgramSum: state.widgetData.by_program_sum_current / 100,
                    totalSumPrev: state.widgetData.total_sum_prev / 100,
                    byProgramSumPrev: state.widgetData.by_program_sum_prev / 100,
                }
            )
            console.log('DATA')
            return {
                chart: [newData.reverse(), totalData.reverse()],
                totalCount: state.widgetData.total_count,
                byProgramCount: state.widgetData.by_program_count,
                totalSum: state.widgetData.total_sum_current / 100,
                byProgramSum: state.widgetData.by_program_sum_current / 100,
                totalSumPrev: state.widgetData.total_sum_prev / 100,
                byProgramSumPrev: state.widgetData.by_program_sum_prev / 100,
            }
        },
    },
}
