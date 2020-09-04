import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        period: localStorage.getItem('filterPeriod') ? JSON.parse(localStorage.getItem('filterPeriod')) : { id: 1, name: 'За сегодня', start: new Date(Date.now()).toISOString(), end: new Date(Date.now()).toISOString() },
        filter: localStorage.getItem('reportFilter') ? JSON.parse(localStorage.getItem('reportFilter')) : { enable: false, pbr: [], bu: [], client: [], operator: [] },
        foundClients: [],
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        const defaultState = getDefaultState()
        Object.assign(state, defaultState)
        localStorage.setItem('reportFilter', JSON.stringify(defaultState.filter))
    },
    period (state, payload) {
        state.period = payload
        localStorage.setItem('filterPeriod', JSON.stringify(payload))
    },
    filter (state, payload) {
        state.filter = payload
        localStorage.setItem('reportFilter', JSON.stringify(state.filter))
    },
    foundClients (state, payload) {
        // объединяем массивы и удаляем дубли
        const stateArr = Object.assign([], state.foundClients)
        const arr = payload
        // массив найденных клиентов
        for (let i = 0; i < arr.length; i++) {
            let find = false
            // массив state
            for (let j = 0; j < stateArr.length; j++) {
                if (arr[i].id === stateArr[j].id) find = true
            }
            if (!find) stateArr.push(arr[i])
        }
        state.foundClients = Object.assign([], stateArr)
    },
}

const actions = {
    async foundClients ({ commit }, item) {
        const res = await ApiService.get(`/api-cabinet/widget/findClient2?program_id=${item.program_id}&client=${item.search}`)
        // console.log('/api-cabinet/widget/findClient')
        // console.log(res)
        commit('foundClients', res)
    },
}

const getters = {
    filter: (state) => state.filter,
    filterDefault: () => {
        const defaultState = getDefaultState()
        return defaultState.filter
    },
    period: (state) => state.period,
    foundClients: (state) => state.foundClients,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
