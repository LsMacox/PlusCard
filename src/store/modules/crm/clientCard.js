import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        loading: false,
        accountScores: [], // счета клиента
        accountBalances: [], // баланс счетов клиента
        transactions: [], // транзакции счетов
        user: {}, // пользователь карты
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    SET_LOADING: (state, payload) => state.loading = payload,
    SET_ACCOUNT_SCORES: (state, payload) => state.accountScores = payload,
    SET_ACCOUNT_BALANCES: (state, payload) => state.accountBalances = payload,
    SET_TRANSACTIONS: (state, payload) => state.transactions = payload,
    SET_USER: (state, payload) => state.user = payload,
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

            this._vm.$notify({
                type: 'success',
                title: 'Клиенты',
                text: 'Операция успешно проведена',
            })
        } catch (error) {
            throw error
        }
    },

    async getAccountUser ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(`/api-cabinet/crm/account/user?id=${item.id}`)
            console.log(`/api-cabinet/crm/account/user?id=${item.id}`)
            console.log(result)
            commit('SET_USER', result)
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
    user: state => state.user,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
