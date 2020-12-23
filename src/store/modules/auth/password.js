import ApiService from '@/api/api-client'

const state = {

}

const mutations = {

}

const actions = {

    async forget ({ commit, state }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post(
                '/api-cabinet/login/email/password/recovery',
                item,
            )
            // console.log(result)
        } catch (error) {
            throw error
        }
    },

    async change ({ commit, state }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post(
                '/api-cabinet/login/email/password/change',
                item,
            )
            // console.log(result)
        } catch (error) {
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
