import ApiService from '@/api/api-client'

const state = {
    certificates: [],
    totalCount: 0,
}

const mutations = {
    clearState (state) {
        state.certificates = []
    },

    certificates (state, payload) {
        state.certificates = payload
    },

    totalCount (state, payload) {
        state.totalCount = payload
    },

    add (state, payload) {
        const items = state.certificates
        items.push(payload)
    },

    update_statuses (state, payload) {
        var index = state.certificates.findIndex(x => x.id === payload.id)
        if (index >= 0) {
            Vue.set(state.certificates, index, Object.assign(state.certificates[index], payload))
            // state.certificates[index].status = payload.status
            // state.certificates[index].payment_status = payload.payment_status

            // state.certificates[index].used_at = payload.used_at
            // state.certificates[index].used = payload.used

            // state.certificates[index].paid_at = payload.paid_at
            // state.certificates[index].paid = payload.paid

            // state.certificates[index].date_issued = payload.date_issued
            // state.certificates[index].issued = payload.issued

            // state.certificates[index].deleted_at = payload.deleted_at
            // state.certificates[index].is_expired = payload.is_expired
        }
    },
    update_archive_status (state, payload) {
        var index = state.certificates.findIndex(x => x.id === payload.id)
        if (index >= 0) {
            state.certificates[index].archived_at = payload.archived_at
        }
    },
    remove (state, payload) {
        const items = state.certificates
        items.forEach((item, index) => {
            if (item.id == payload.id) items.splice(index, 1)
        })
    },
}

const actions = {

    async list ({ commit }, { merchant_id, offset, limit }) {
        // eslint-disable-next-line no-useless-catch
        try {
            // console.log('merchant_id', merchant_id)
            console.log(offset, limit)
            const success = await ApiService.get('api-cabinet/client/certificate/list2', {
                params: {
                    merchant_id: merchant_id,
                    offset: offset,
                    limit: limit,
                },
            })
            console.log(success)
            commit('certificates', success.certificates)
            commit('totalCount', success.totalCount)
        } catch (error) {
            throw error
        }
    },
    async changeArchiveStatus ({ commit, dispatch }, postData) {
        const response = await ApiService.post('/client/certificate/status/archive', postData)
        /// /console.log(success)
        commit('update_archive_status', response.data.data)
    },
    async Restore ({ commit, dispatch }, postData) {
        const response = await ApiService.post('/api/program/certificate/order/restore', postData)
        /// /console.log(success)
        commit('update_statuses', response.data.data)
    },
    async Delete ({ commit, dispatch }, postData) {
        const response = await ApiService.delete('/api/program/certificate/order/delete', postData)
        /// /console.log(success)
        commit('update_statuses', response.data.data)
    },
    async Continue ({ commit, dispatch }, postData) {
        const response = await ApiService.post('/api/program/certificate/order/continue', postData)
        /// /console.log(success)
        commit('update_statuses', response.data.data)
    },

    async updateShop ({ commit, dispatch }, shop) {
        try {
            const success = await ApiService.post('/api/partner/certificates/update', shop)
            /// ///console.log(success)
            commit('updateIncertificates', success.data.data)
            dispatch('ShowNotify', {
                title: 'Plus',
                message: 'Магазин обновлен',
                type: 'success',
            }, { root: true })
        } catch (error) {
            throw error
        }
    },

}

const getters = {
    certificates (state) {
        return state.certificates
    },

    totalCount (state) {
        return state.totalCount
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}