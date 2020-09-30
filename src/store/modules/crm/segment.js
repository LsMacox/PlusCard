import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        segments: 
            [
                {
                    id: 1234,
                    name: 'М 18-25 Выше среднего Москва',
                    client_count: 12243,
                    profit: 26328398,
                    average_check: 8345,
                    label_color: '#4776e6',
                    client_cost: 314,
                    description: 'Какое-то описание'
                }, 
                {
                    id: 1236,
                    name: 'Новые',
                    client_count: 12243,
                    profit: 26328398,
                    average_check: 8345,
                    label_color: '#95C5DA',
                    client_cost: 314,
                    description: 'Какое-то описание'
                },
                {
                    id: 1233,
                    name: 'Не лояльные',
                    client_count: 12243,
                    profit: 26328398,
                    average_check: 8345,
                    label_color: '#FFA338',
                    client_cost: 314,
                    description: 'Какое-то описание'
                },
            ]
    },
    mutations: {
        segments (state, payload) {
            state.segments = payload
        },

        // === this mutator is for example === //
        segmentUpdateById(state, payload) {
            let editDataIndex = this._vm.$_.findIndex(state.segments, (o) => {
                return o.id == payload.id
            })
            Object.assign(state.segments[editDataIndex], payload.data)
        },
        segmentDeleteById(state, id) {
            let editDataIndex = this._vm.$_.findIndex(state.segments, (o) => {
                return o.id == id
            })
            state.segments.splice(editDataIndex, 1)
        },
        segmentCreate(state, payload) {
            state.segments.push({
                id: this._vm.$random.int(1000, 9999),
                name: payload.name,
                client_count: 12243,
                profit: 26328398,
                average_check: 8345,
                client_cost: 314,
                label_color: payload.color,
                description: payload.description
            })
        }
    },
    actions: {
        async createSegment({ commit }, payload) {
            // const result = await ApiService.post('/api-cabinet/crm/segment/create', segment)

            // ==== Example ==== //
            commit('segmentCreate', payload) // this mutator is for example
            // ==== Example ==== // 

            commit('segments', result)
        },
        async editSegment({ commit }, payload) {
            // const result = await ApiService.putch('/api-cabinet/crm/segment/edit', segment)

            // ==== Example ==== //
            commit('segmentUpdateById', payload) // this mutator is for example
            // ==== Example ==== // 
        },

        async deleteSegment({ commit }, id) {
            // const result = await ApiService.delete(`/api-cabinet/crm/segment/delete`, id)

            // ==== Example ==== //
            commit('segmentDeleteById', id) // this mutator is for example
            // ==== Example ==== // 
        }
    },
    getters: {
        segments (state) {
            return state.segments
        },
    },
}
