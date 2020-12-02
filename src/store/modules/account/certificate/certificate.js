import ApiService from '@/api/api-client'
import Vue from 'vue'

const state = {
    certificates: [],
    programCertificates: [],
    totalCount: 0,
}

const mutations = {
    clearState (state) {
        state.certificates = []
    },

    certificates (state, payload) {
        state.certificates = payload
    },

    programCertificates (state, payload) {
        state.programCertificates = payload
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
            if (item.id === payload.id) items.splice(index, 1)
        })
    },
}

const actions = {

    async list ({ commit }, item) {
            // eslint-disable-next-line no-useless-catch
        try {
            console.log('<ITEM>')
            console.log(item)
            console.log('<ITEM>')
            const success = await ApiService.post('api-cabinet/client/certificate/list2', item)
            commit('certificates', success.certificates)
            commit('totalCount', success.totalCount)
        } catch (error) {
            throw error
        }
    },
    async programCertificates ({ commit }, programId) {
        console.log(programId)
        // eslint-disable-next-line no-useless-catch
        try {
            const success = await ApiService.get('api-cabinet/client/certificate/program/list', {
                params: {
                    program_id: programId,
                },
            })
            commit('programCertificates', success)
        } catch (error) {
            throw error
        }
    },
    async changeArchiveStatus ({ commit, dispatch }, postData) {
        const result = await ApiService.post('/api-cabinet/client/certificate/status/archive', postData)
        /// /console.log(success)
        commit('update_archive_status', result)
    },
    async Restore ({ commit, dispatch }, postData) {
        const result = await ApiService.post('/api/program/certificate/order/restore', postData)
        /// /console.log(success)
        commit('update_statuses', result)
    },
    async Delete ({ commit, dispatch }, userCert) {
        if (!userCert.order) return
        await this._vm.$confirm(
            `Вы уверены, что хотите удалить заказ сертификата № "${userCert.order.num}" в корзину?`,
            'Удаление заказа сертификата в корзину',
            {
              confirmButtonText: 'Удалить',
              cancelButtonText: 'Отмена',
              type: 'warning',
            },
          )

        const result = await ApiService.delete('/api/program/certificate/order/delete', {
            params: { id: userCert.id },
        })
        /// /console.log(success)
        commit('update_statuses', result)
    },
    async Continue ({ commit }, { id, expiresAt }) {
        console.log('Continue', { id, expiresAt })
        const result = await ApiService.post('/api/program/certificate/order/continue', {
            id,
            expires_at: expiresAt,
        })

        commit('update_statuses', result)
    },
    async CertOrderPaid ({ commit, dispatch }, { id, type, transactionId, comment }) {
        const result = await ApiService.post('/api/program/certificate/order/paid', { id, type, transaction_id: transactionId, comment })
        /// /console.log(success)
        commit('update_statuses', result)
    },
    async CertOrderUsedCode ({ commit, dispatch }, id) {
        const result = await ApiService.post('/api/program/certificate/order/used/code',
        {
          id,
        })
        return result
    },
    async CertOrderUsed ({ commit, dispatch }, { id, useCode }) {
        const result = await ApiService.post('/api/program/certificate/order/used',
        {
          id, use_code: useCode,
        })
        commit('update_statuses', result)
        return result
    },

}

const getters = {
    certificates (state) {
        return state.certificates
    },
    programCertificates (state) {
        return state.programCertificates
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
