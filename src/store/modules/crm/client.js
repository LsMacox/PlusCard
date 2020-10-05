import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        clients: [], // клиенты компании
        filter: [],
        list: {
            page: 1,
            itemsPerPage: 25,
        },
        total: 0,
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    SET_CLIENTS: (state, payload) => state.clients = payload,
    SET_FILTER: (state, payload) => state.filter = payload,
    SET_LIST: (state, payload) => state.list = payload,
    SET_TOTAL: (state, payload) => state.total = payload,
    ADD (state, payload) {
        const items = state.clients
        items.push(payload)
    },
    UPDATE (state, payload) {
        const items = state.clients
        items.forEach((item, index) => {
            if (item.id === payload.id) Object.assign(items[index], payload)
        })
    },
    REMOVE (state, payload) {
        const items = state.clients
        items.forEach((item, index) => {
            if (item.id === payload.id) items.splice(index, 1)
        })
    },
}

const actions = {

    resetState ({ commit }) {
        commit('RESET_STATE')
    },

    async list ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post('/api-cabinet/merchant/account/list2', item)
            console.log('/api-cabinet/merchant/account/list2')
            console.log(result)
            commit('SET_CLIENTS', result.items)
            commit('SET_TOTAL', result.total)
        } catch (error) {
            throw error
        }
    },

}

const getters = {
    clients: state => state.clients,
    filter: state => state.filter,
    list: state => state.list,
    total: state => state.total,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
