export default {
    namespaced: true,
    state: {
        loading: false,
        startPeriod: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        endPeriod: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],

        period: 7,
        widgetData: [],
        graphData: {
            labels: [],
            datasets: [],
        },
    },
    mutations: {
        clearState (state) {
            state.loading = false
            state.startPeriod = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]
            state.endPeriod = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]
            state.period = 7
            state.widgetData = []
            state.graphData = {
                labels: [],
                datasets: [],
            }
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
        period (state, payload) {
            state.period = payload
        },
        widgetData (state, payload) {
            state.widgetData = payload
        },
        graphData (state, payload) {
            state.graphData = payload
        },
    },
    actions: {
        async widget ({ commit }, widget) {
            const success = await axios.post('/api/widget/totals', widget)
            commit('widgetData', success.data.data)
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

        period (state) {
            return state.period
        },
        widgetData (state) {
            return state.widgetData
        },
        graphData (state) {
            return state.graphData
        },
        operationsSumm (state) {
            if (state.widgetData.length) {
                const operationsSumm = Object.assign([], state.widgetData)
                operationsSumm.reverse()
                operationsSumm.forEach(item => item.operations_summ = item.operations_summ / 1000)
                return operationsSumm
            }
            return []
        },
    },
}
