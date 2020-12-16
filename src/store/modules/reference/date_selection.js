const getDefaultState = () => {
    return {
        period: localStorage.getItem('dateSelection') ? JSON.parse(localStorage.getItem('dateSelection')) : getDefaultPeriod(),
        periods: [
            { id: 1, name: 'за сегодня', start: new Date(Date.now()).toISOString(), end: new Date(Date.now()).toISOString() },
            { id: 2, name: 'за последние 7 дней', start: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
            { id: 3, name: 'за последние 30 дней', start: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
            { id: 4, name: 'за последние 90 дней', start: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
            { id: 5, name: 'за последние 180 дней', start: new Date(Date.now() - 180 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
            { id: 6, name: 'за последние 365 дней', start: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
            // { id: 7, name: 'собственный диапазон', start: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(), end: new Date(Date.now()).toISOString() },
        ],
    }
}

const getDefaultPeriod = () => {
    return {
        id: 1, name: 'За сегодня', start: new Date(Date.now()).toISOString().split('T')[0], end: new Date(Date.now()).toISOString().split('T')[0],
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state.period, getDefaultPeriod())
        localStorage.setItem('dateSelection', JSON.stringify(getDefaultPeriod()))
    },
    periodId (state, payload) {
        const period = state.periods.find(item => item.id === payload)
        if (period) {
            state.period = period
            localStorage.setItem('dateSelection', JSON.stringify(period))
        }
    },
    period (state, payload) {
        state.period = payload
        localStorage.setItem('dateSelection', JSON.stringify(payload))
    },
}

const actions = {

}

const getters = {
    periodId: (state) => state.period.id,
    period: (state) => state.period,
    periods: (state) => state.periods,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
