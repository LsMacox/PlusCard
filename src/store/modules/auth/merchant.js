import ApiService from '@/api/api-client'
import VueSession from '@/utils/session'

const state = {
    balanceOperations: [],
    tariffs: [],
    orders: [],
}

const mutations = {
    BALANCE_OPERATIONS (state, data) {
        state.balanceOperations = data
      },
      SET_ORDERS (state, data) {
        state.orders = data
      },
      SET_TARIFFS (state, data) {
        state.tariffs = data
      },
      ADD_ORDER (state, payload) {
        state.orders.push(payload)
      },
      REMOVE_ORDER (state, orderId) {
        var index = state.orders.findIndex(x => x.id === orderId)
        if (index >= 0) {
          state.orders.splice(index, 1)
        }
      },
      UPDATE_MERCHANT_TARIFF (state, payload) {
        state.merchant = Object.assign(state.merchant, payload)
    },

}

const actions = {

    async login ({ commit, state }, user) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post(
                '/api-cabinet/login/merchant',
                user,
            )
            // console.log(result)
            commit('auth/auth/SET_AUTH', result, { root: true })
        } catch (error) {
            commit('auth/auth/SET_AUTH', null, { root: true })
            throw error
        }
    },

    async read ({ commit }) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(
                '/api-cabinet/merchant',
            )
            // console.log('/api-cabinet/merchant')
            // console.log(result)
            commit('auth/auth/SET_MERCHANT', result, { root: true })
            commit('auth/auth/SET_MERCHANT_ID', result.id, { root: true })
            VueSession.set('merchant_id', result.id)
        } catch (error) {
            commit('auth/auth/SET_AUTH', null, { root: true })
            throw error
        }
    },

    async GetBalanceOperations ({ commit, rootGetters }) {
        console.log('GetBalanceOperations', rootGetters.merchantId)
        const result = await ApiService.get(`/api/merchant/balance/operations?merchant_id=${rootGetters.merchantId}`)
        commit('BALANCE_OPERATIONS', result)
        return result
      },

      async GetOrders ({ rootGetters, commit }) {
        const result = await ApiService.get(`/api/merchant/order/list?merchant_id=${rootGetters.merchantId}`)
        commit('SET_ORDERS', result)
        return result
      },

      async GetOrderPdf ({ rootGetters, commit }, order) {
        await ApiService.downloadFile('/api/merchant/order/pdf', {
          order_id: order.id,
        }, `Счет №${order.number}.pdf`)
      },

      async CreateOrder ({ rootGetters, commit }, { value, method, description }) {
        const result = await ApiService.post('/api/merchant/order/create', {
          merchant_id: rootGetters.merchantId,
          method: method,
          value: value,
          description: description,

        })
        commit('ADD_ORDER', result)
        return result
      },

      async DeleteOrder ({ state, rootState, commit }, orderId) {
        await ApiService.delete(`/api/merchant/order/delete?order_id=${orderId}`)
        commit('REMOVE_ORDER', orderId)
      },

      async GetAvaibleTariffs ({ state, commit }) {
        const result = await ApiService.get('/api/tariff/list')
        commit('SET_TARIFFS', result)
        return result
      },

      async ChangeTariff ({ state, commit }, { merchant_id, tariff_id }) {
        const result = await ApiService.post('/api/merchant/tariff/change', {
          merchant_id: merchant_id,
          tariff_id: tariff_id,
        })
        commit('update_merchant_tariff', result)
        return result
      },

      async ChangeAutoRenewTariff ({ state, commit }, { merchant_id, auto_renew }) {
        const result = await ApiService.post('/api/merchant/tariff/autorenew', {
          merchant_id: merchant_id,
          auto_renew: auto_renew,
        })
        commit('update_merchant_tariff', result)
        return result
      },

      async RenewTariff ({ state, commit }, { merchant_id }) {
        const result = await ApiService.post('/api/merchant/tariff/renew', {
          merchant_id: merchant_id,
        })
        commit('update_merchant_tariff', result)
        return result
      },
}

const getters = {
    balanceOperations (state) {
        return state.balanceOperations
      },
      orders (state) {
        return state.orders
      },
      tariffs (state) {
        return state.tariffs
      },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
