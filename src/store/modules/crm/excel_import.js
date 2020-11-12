import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        step: 1, // шаг импорта
        steps: 3,
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    SET_STEP: (state, payload) => state.step = payload,
}

const actions = {

    resetState ({ commit }) {
        commit('RESET_STATE')
    },

    async list ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post('/api-cabinet/crm/account/list2', item)
            console.log('/api-cabinet/crm/account/list2')
            console.log(result)
            commit('SET_CLIENTS', result.items)
            commit('SET_TOTAL', result.total)
        } catch (error) {
            throw error
        }
    },

}

const getters = {
    step: state => state.step,
    steps: state => state.steps,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
