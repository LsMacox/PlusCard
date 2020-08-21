import ApiService from '@/api/api-client'

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
