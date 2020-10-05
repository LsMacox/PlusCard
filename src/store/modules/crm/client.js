import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        clients: [], // клиенты компании
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    SET_CLIENTS: (state, payload) => state.clients = payload,
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

    async list ({ commit }) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get('/api-cabinet/company/list')
            // console.log(result)
            commit('SET_CLIENTS', result)
        } catch (error) {
            throw error
        }
    },

}

const getters = {
    clients: state => state.clients,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
