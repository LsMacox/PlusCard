import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        loading: false,
        segments: [],
    },
    mutations: {
        segments (state, payload) {
            state.segments = payload
        },

        // === this mutator is for example === //
        segmentUpdateById (state, payload) {
            const editDataIndex = this._vm.$_.findIndex(state.segments, (o) => {
                return o.id === payload.id
            })

            Object.assign(state.segments[editDataIndex], payload)

            this._vm.$notify({
                type: 'success',
                title: 'Сегменты',
                text: 'Сегмент успешно обновлен',
            })
        },
        segmentDeleteById (state, payload) {
            const deleteDataIndex = this._vm.$_.findIndex(state.segments, (o) => {
                return o.id === payload.id
            })
            console.log('delete_DataIndex')
            console.log(deleteDataIndex)
            console.log('delete_DataIndex')
            state.segments.splice(deleteDataIndex, 1)

            this._vm.$notify({
                type: 'success',
                title: 'Сегменты',
                text: 'Сегмент успешно удален',
            })
        },
        segmentCreate (state, payload) {
            console.log('mutation')
            console.log(payload)
            console.log('mutation')
            state.segments.push(payload)

            this._vm.$notify({
                type: 'success',
                title: 'Сегменты',
                text: 'Сегмент успешно создан',
            })
        },
        loading (state, payload) {
            state.loading = payload
        },
    },
    actions: {
        async segments ({ commit }, payload) {
            commit('loading', true)
            console.log('table data.......')

            const result = await ApiService.get('/api-cabinet/program/client/segment/list', {
                params: payload,
            })
            console.log('table data.......')
            console.log(result)
            console.log('table data.......')
            commit('segments', result)
            commit('loading', false)
        },
        async createSegment ({ commit }, payload) {
            const result = await ApiService.post('/api-cabinet/program/client/segment/create', payload)

            commit('segmentCreate', result)
        },
        async editSegment ({ commit }, payload) {
            console.log('editSegm')
            console.log(payload)
            console.log('editSegm')
            const result = await ApiService.post('/api-cabinet/program/client/segment/update', payload)

            commit('segmentUpdateById', result) // this mutator is for example
        },

        async deleteSegment ({ commit }, payload) {
            console.log('DELETE')
            console.log(payload)
            console.log('DELETE')
            const result = await ApiService.delete('/api-cabinet/program/client/segment/delete', { params: payload })

            if (result) {
                commit('segmentDeleteById', result)
            }
        },
    },
    getters: {
        segments (state) {
            return state.segments
        },
    },
}
