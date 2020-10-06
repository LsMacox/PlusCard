import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        clients: [5].fill(
            {
                id: '103112',
                gender: true,
                date_of_birth: '10.03.1990',
                city: 'Новокузнецк',
                name: 'Константин',
                surname: 'Константинопольский',
                online: '02.08.2020 04:32',
                phone: '79832525202',
                email: 'rs.bikeev@yandex.ru',
                code: '1640000000145437',
                card: '432156',
                img_avatar: require('@/assets/png/custom/beardedman.png'),
            }
        )
    },
    mutations: {
        clients(state, payload) {
            state.clients = payload
        },

        // === this mutator is for example === //
        clientUpdateById(state, payload) {
            let editDataIndex = this._vm.$_.findIndex(state.clients, (o) => {
                return o.id == payload.id
            })
            Object.assign(state.clients[editDataIndex], payload.data)
        },
        clientDeleteById(state, id) {
            let editDataIndex = this._vm.$_.findIndex(state.clients, (o) => {
                return o.id == id
            })
            state.clients.splice(editDataIndex, 1)
        },
        clientCreate(state, payload) {
            state.clients.push({
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
        async createClient({commit}, payload) {
            // const result = await ApiService.post('/api-cabinet/crm/client/create', payload)

            // ==== Example ==== //
            commit('clientCreate', payload) // this mutator is for example
            // ==== Example ==== // 

            commit('clients', result)
        },
        async editClient({commit}, payload) {
            // const result = await ApiService.putch('/api-cabinet/crm/client/edit', payload)

            // ==== Example ==== //
            commit('clientUpdateById', payload) // this mutator is for example
            // ==== Example ==== // 
        },

        async deleteClient({commit}, id) {
            // const result = await ApiService.delete(`/api-cabinet/crm/client/delete`, id)

            // ==== Example ==== //
            commit('clientDeleteById', id) // this mutator is for example
            // ==== Example ==== // 
        }
    },
    getters: {
        clients(state) {
            return state.clients
        },
    },
}
