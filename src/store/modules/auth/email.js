import ApiService from '@/api/api-client'

const state = {

}

const mutations = {

}

const actions = {

    async registration ({ commit, state }, user) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post(
                '/api-cabinet/merchant/registration',
                user,
            )
            console.log(result)
        } catch (error) {
            throw error
        }
    },

    async login ({ commit, state }, user) {
        try {
            const result = await ApiService.post(
                '/api-cabinet/merchant/login/email/signin',
                user,
            )
            console.log(result)
            commit('auth/auth/SET_AUTH', result, { root: true })
        } catch (error) {
            commit('auth/auth/SET_AUTH', null, { root: true })
            throw error
        }
    },
}

const getters = {
    // merchants: state => state.merchants,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
