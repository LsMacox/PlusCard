import ApiService from '@/api/api-client'
import VueSession from '@/utils/session'

const state = {

}

const mutations = {

}

const actions = {

    async login ({ commit, state }, user) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post(
                '/api-cabinet/login/merchant',
                user,
            )
            console.log(result)
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
}

const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
