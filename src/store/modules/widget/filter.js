import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        startPeriod: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        endPeriod: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        filter: { enable: false, pbr: [], bu: [], client: [], operator: [] },
        // startPeriodFilter: localStorage.getItem('startPeriodFilter') ? localStorage.getItem('startPeriodFilter') : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        startPeriodFilter: localStorage.getItem('startPeriodFilter') ? localStorage.getItem('startPeriodFilter') : new Date(Date.now() - 7776000000 - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        endPeriodFilter: localStorage.getItem('endPeriodFilter') ? localStorage.getItem('endPeriodFilter') : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
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
    startPeriod (state, payload) {
        state.startPeriod = payload
    },
    endPeriod (state, payload) {
        state.endPeriod = payload
    },
    filter (state, payload) {
        state.filter = payload
        localStorage.setItem('reportFilter', JSON.stringify(state.filter))
    },
    startPeriodFilter (state, payload) {
        state.startPeriodFilter = payload
        localStorage.setItem('startPeriodFilter', payload)
    },
    endPeriodFilter (state, payload) {
        state.endPeriodFilter = payload
        localStorage.setItem('endPeriodFilter', payload)
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
    filter ({ commit }) {
        if (localStorage.getItem('reportFilter')) {
            const filterLocal = JSON.parse(localStorage.getItem('reportFilter'))
            if (filterLocal) {
                commit('filter', filterLocal)
            }
        }
    },
    async filterPeriod ({ commit }) {
        // console.log('filterPeriod')
        // console.log('localFilterStartPeriod', localStorage.getItem('startPeriodFilter'))
        // console.log('localFilterEndPeriod', localStorage.getItem('endPeriodFilter'))
        const startPeriod = localStorage.getItem('startPeriodFilter')
        const endPeriod = localStorage.getItem('endPeriodFilter')
        if (startPeriod) commit('startPeriodFilter', startPeriod)
        if (endPeriod) commit('endPeriodFilter', endPeriod)
    },
    async foundClients ({ commit }, item) {
        const res = await ApiService.get(`/api-cabinet/widget/findClient2?program_id=${item.program_id}&client=${item.search}`)
        // console.log('/api-cabinet/widget/findClient')
        // console.log(res)
        commit('foundClients', res)
    },
}

const getters = {
    startPeriod: (state) => state.startPeriod,
    endPeriod: (state) => state.endPeriod,
    filter: (state) => state.filter,
    filterDefault: () => {
        const defaultState = getDefaultState()
        return defaultState.filter
    },
    startPeriodFilter: (state) => state.startPeriodFilter,
    endPeriodFilter: (state) => state.endPeriodFilter,
    foundClients: (state) => state.foundClients,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
