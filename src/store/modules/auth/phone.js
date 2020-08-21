import ApiService from '@/api/api-client'

const state = {
    loginId: null,
}

const mutations = {
    // eslint-disable-next-line no-return-assign
    loginId: (state, payload) => state.loginId = payload.id,
}

const actions = {

    async login ({ commit, state }, user) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post(
                '/api-cabinet/login/phone',
                user,
            )
            console.log(result)
            commit('loginId', result)
        } catch (error) {
            // commit('auth/auth/SET_AUTH', null, { root: true })
            throw error
        }
    },

    async confirm ({ commit, state }, user) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post(
                '/api-cabinet/login/phone/confirm',
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
    loginId: state => state.loginId,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
