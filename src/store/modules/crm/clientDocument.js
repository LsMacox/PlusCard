import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        documents: [], // документы карты
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    SET_DOCUMENTS: (state, payload) => state.documents = payload,
    ADD_TO_DOCUMENTS (state, payload) {
        const items = state.documents
        items.push(payload)
    },
    UPDATE_IN_DOCUMENTS (state, payload) {
        const items = state.documents
        items.forEach((item, index) => {
            if (item.id === payload.id) Object.assign(items[index], payload)
        })
    },
    REMOVE_FROM_DOCUMENTS (state, payload) {
        const items = state.documents
        items.forEach((item, index) => {
            if (item.id === payload.id) items.splice(index, 1)
        })
    },
}

const actions = {

    resetState ({ commit }) {
        commit('RESET_STATE')
    },

    async create ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post('/api-cabinet/crm/account/document', item)
            console.log('/api-cabinet/crm/account/document')
            console.log(result)
            commit('ADD_TO_DOCUMENTS', result)
        } catch (error) {
            throw error
        }
    },

    async list ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(`/api-cabinet/crm/account/document/list?account_id=${item.account_id}&page=${item.page}&limit=${item.limit}`)
            console.log(`/api-cabinet/crm/account/document/list?account_id=${item.account_id}&page=${item.page}&limit=${item.limit}`)
            console.log(result)
            commit('SET_DOCUMENTS', result)
        } catch (error) {
            throw error
        }
    },

    async update ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.put('/api-cabinet/crm/account/document', item)
            console.log('/api-cabinet/crm/account/document')
            console.log(result)
            commit('UPDATE_IN_DOCUMENTS', result)
        } catch (error) {
            throw error
        }
    },

}

const getters = {
    documents: state => state.documents,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
