import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        templates: [],
        template: {},
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    SET_TEMPLATES (state, payload) {
        state.templates = payload
    },
    SET_TEMPLATE (state, payload) {
        state.template = payload
    },
    ADD (state, payload) {
        const items = state.templates
        items.push(payload)
    },
    UPDATE (state, payload) {
        const items = state.templates
        items.forEach((item, index) => {
            if (item.id === payload.id) Object.assign(items[index], payload)
        })
    },
    REMOVE (state, payload) {
        const items = state.templates
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
            const result = await ApiService.post('/api-cabinet/program/notifications/create', item)
            // console.log('/api-cabinet/staff')
            // console.log(result)
            commit('ADD', result)
            this._vm.$notify({
                type: 'success',
                title: 'Шаблоны рассылки',
                text: 'Шаблон успешно создан',
            })
        } catch (error) {
            throw error
        }
    },

    async list ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(`/api-cabinet/program/notifications/list?program_id=${item.program_id}`)
            console.log('/api-cabinet/program/notifications/list')
            console.log(result)
            commit('SET_TEMPLATES', result)
        } catch (error) {
            throw error
        }
    },

    async read ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(`/api-cabinet/program/notifications?id=${item.id}`)
            // console.log('/api-cabinet/staff')
            // console.log(result)
            commit('SET_TEMPLATE', result)
        } catch (error) {
            throw error
        }
    },

    async update ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post('/api-cabinet/program/notifications/update', item)
            // console.log('/api-cabinet/staff')
            // console.log(result)
            commit('UPDATE', result)
            this._vm.$notify({
                type: 'success',
                title: 'Шаблоны рассылки',
                text: 'Шаблон успешно изменен',
            })
        } catch (error) {
            throw error
        }
    },

    async delete ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.delete(`/api-cabinet/program/notifications?id=${item.id}`)
            // console.log('/api-cabinet/staff')
            // console.log(result)
            commit('REMOVE', result)
        } catch (error) {
            throw error
        }
    },

}

const getters = {
    templates: state => state.templates,
    template: state => state.template,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
