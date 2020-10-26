import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        loading: false,
        accountScores: [], // счета клиента
        accountBalances: [], // баланс счетов клиента
        transactions: [], // транзакции счетов
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    SET_LOADING: (state, payload) => state.loading = payload,
    SET_ACCOUNT_SCORES: (state, payload) => state.accountScores = payload,
    SET_ACCOUNT_BALANCES: (state, payload) => state.accountBalances = payload,
    SET_TRANSACTIONS: (state, payload) => state.transactions = payload,
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

    //
    async getAccountScores ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(`/api/account/bonus/score/list?account_id=${item.id}`)
            console.log(`/api/account/bonus/score/list?account_id=${item.id}`)
            console.log(result)
            commit('SET_ACCOUNT_SCORES', result)
        } catch (error) {
            throw error
        }
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

    async transactionsList ({ commit }, item) {
        const result = await ApiService.get(`/api/account/bonus/transactions/list?account_id=${item.id}`)

        console.log('/api/account/bonus/transactions/list')
        console.log(result)

        commit('SET_TRANSACTIONS', result)
    },

    // account/bonus/transactions/add
    async transactionsAdd ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post('/api/account/bonus/transactions/add', item)
            console.log('/api/account/bonus/transactions/add')
            console.log(result)
        } catch (error) {
            throw error
        }
    },

}

const getters = {
    loading: state => state.loading,
    accountScores: state => state.accountScores,
    accountBalances: state => state.accountBalances,
    transactions: state => state.transactions,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}