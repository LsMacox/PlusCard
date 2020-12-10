import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        sendings: [],
        sending: {},
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    SET_SENDINGS (state, payload) {
        state.sendings = payload
    },
    SET_SENDING (state, payload) {
        state.sending = payload
    },
    ADD (state, payload) {
        const items = state.sendings
        items.push(payload)
    },
    UPDATE (state, payload) {
        const items = state.sendings
        items.forEach((item, index) => {
            if (item.id === payload.id) Object.assign(items[index], payload)
        })
    },
    REMOVE (state, payload) {
        const items = state.sendings
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
            const result = await ApiService.post('/api-cabinet/program/notifications', item)
            commit('ADD', result)
            this._vm.$notify({
                type: 'success',
                title: 'Рассылки',
                text: 'Рассылка успешно создана',
            })
            return result
        } catch (error) {
            throw error
        }
    },

    async list ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(`/api-cabinet/program/notifications/list?program_id=${item.program_id}`)
            commit('SET_SENDINGS', result)
        } catch (error) {
            throw error
        }
    },

    async read ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(`/api-cabinet/program/notifications?id=${item.id}`)
            commit('SET_SENDING', result)
        } catch (error) {
            throw error
        }
    },

    async active ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.put('/api-cabinet/program/notifications/active', item)
            // console.log('/api-cabinet/staff')
            // console.log(result)
            commit('UPDATE', result)
            if (result.active) {
                this._vm.$notify({
                    type: 'success',
                    title: 'Рассылки',
                    text: 'Рассылка запущена',
                })
            } else {
                this._vm.$notify({
                    type: 'success',
                    title: 'Рассылки',
                    text: 'Рассылка остановлена',
                })
            }
        } catch (error) {
            throw error
        }
    },

    async delete ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            await ApiService.delete(`/api-cabinet/program/notifications/${item.id}`)
            // console.log('/api-cabinet/staff')
            // console.log(result)
            commit('REMOVE', item)
            this._vm.$notify({
                type: 'success',
                title: 'Рассылки',
                text: 'Рассылка удалена',
            })
        } catch (error) {
            throw error
        }
    },

}

const getters = {
    sendings: state => state.sendings,
    sending: state => state.sending,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
