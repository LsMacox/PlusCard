import ApiService from '@/api/api-client'

const getDefaultState = () => {
    return {
        templates: [],
        notificationPickList: [],
        template: {},
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    SET_TEMPLATES (state, payload) {
        state.templates = payload
    },
    SET_NOTIFICATION_PICK_LIST (state, payload) {
        state.notificationPickList = payload
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
            const result = await ApiService.post('/api-cabinet/program/notifications', item)
            commit('ADD', result)
            commit('SET_TEMPLATE', result) // после создания шаблона переход на форму редактирования
            this._vm.$notify({
                type: 'success',
                title: 'Шаблоны рассылки',
                text: 'Шаблон успешно создан',
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
            console.log('/api-cabinet/program/notifications/list')
            console.log(result)
            commit('SET_TEMPLATES', result)
        } catch (error) {
            throw error
        }
    },

    async getPickList ({ commit }, programId) {
            const result = await ApiService.get(`/api-cabinet/program/notifications/shortlist?program_id=${programId}`)
            commit('SET_NOTIFICATION_PICK_LIST', result)
    },

    async read ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(`/api-cabinet/program/notifications?id=${item.id}`)
            commit('SET_TEMPLATE', result)
        } catch (error) {
            throw error
        }
    },

    async update ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.put('/api-cabinet/program/notifications', item)
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
            await ApiService.delete(`/api-cabinet/program/notifications?id=${item.id}`)
            // console.log('/api-cabinet/staff')
            // console.log(result)
            commit('REMOVE', item)
            this._vm.$notify({
                type: 'success',
                title: 'Шаблоны рассылки',
                text: 'Шаблон удален',
            })
        } catch (error) {
            throw error
        }
    },

    /*
     * ATTACHMENTS
     */

    async createAttachment ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post('/api-cabinet/program/notifications/attachments', item)
            // console.log(result)
            commit('UPDATE', result)
            commit('SET_TEMPLATE', result)
            this._vm.$notify({
                type: 'success',
                title: 'Шаблоны рассылки',
                text: 'Блок успешно создан',
            })
        } catch (error) {
            throw error
        }
    },

    async updateAttachment ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post('/api-cabinet/program/notifications/attachments/update', item)
            // console.log(result)
            commit('UPDATE', result)
            commit('SET_TEMPLATE', result)
            this._vm.$notify({
                type: 'success',
                title: 'Шаблоны рассылки',
                text: 'Блок успешно изменен',
            })
        } catch (error) {
            throw error
        }
    },

    async sortAttachment ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.put('/api-cabinet/program/notifications/attachments/sort', item)
            commit('UPDATE', result)
            commit('SET_TEMPLATE', result)
        } catch (error) {
            throw error
        }
    },

    async deleteAttachment ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.delete(`/api-cabinet/program/notifications/attachments?id=${item.id}`)
            commit('UPDATE', result)
            commit('SET_TEMPLATE', result)
            this._vm.$notify({
                type: 'success',
                title: 'Шаблоны рассылки',
                text: 'Блок удален',
            })
        } catch (error) {
            throw error
        }
    },

}

const getters = {
    templates: state => state.templates,
    notificationPickList: state => state.notificationPickList,
    template: state => state.template,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
