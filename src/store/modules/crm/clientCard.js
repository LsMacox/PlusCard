import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        accountBalances: [], // счета клиента
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    SET_ACCOUNT_BALANCES: (state, payload) => state.accountBalances = payload,
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

    async getAccountBalances ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(`/api-cabinet/crm/account/balance?id=${item.id}`)
            console.log(`/api-cabinet/crm/account/balance?id=${item.id}`)
            console.log(result)
            commit('SET_ACCOUNT_BALANCES', result)
        } catch (error) {
            throw error
        }
    },

}

const getters = {
    accountBalances: state => state.accountBalances,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
