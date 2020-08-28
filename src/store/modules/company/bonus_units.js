import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        bonusUnits: [],
        bonusUnitIcons: [],
        unitTypesEnum: [{
                text: 'Целое число',
                value: 'INTEGER',
            },
            {
                text: 'Дробное число',
                value: 'FLOAT',
            },
        ],
    },
    mutations: {
        bonusUnits (state, payload) {
            state.bonusUnits = payload
        },
        bonusUnitIcons (state, payload) {
            state.bonusUnitIcons = payload
        },
        addBonusUnits (state, payload) {
            if (payload.is_main) {
                state.bonusUnits.forEach(element => {
                    element.is_main = false
                })
            }
            state.bonusUnits.push(payload)
        },
        updateBonusUnits (state, payload) {
            const index = state.bonusUnits.findIndex(x => x.id === payload.id)
            if (index >= 0) {
                if (payload.is_main) {
                    state.bonusUnits.forEach(element => {
                        element.is_main = false
                    })
                }
                Vue.set(state.bonusUnits, index, payload)
            }
        },
        removeBonusUnits (state, payload) {
            const index = state.bonusUnits.findIndex(x => x.id === payload.id)
            state.bonusUnits.splice(index, 1)
        },

    },
    actions: {
        async getBonusUnitIcons ({
            commit,
            dispatch,
        }) {
            try {
                const success = await ApiService.get('/api-cabinet/bonus_units/icons')
                commit('bonusUnitIcons', success.data.data)
            } catch (error) {

            }
        },

        async createBonusUnit ({
            commit,
        }, bonusUnit) {
            ApiService.post('/api-cabinet/bonus_units/create').then((resp) => {
                commit('addBonusUnits', resp)
            })
        },

        // READ
        async loadBonusUnits ({
            commit,
            dispatch,
        }, programId) {
            try {
                const success = await ApiService.get(`/api-cabinet/bonus_units/list?program_id=${programId}`)
                console.log('/api/bonus_units/list')
                console.log(success)
                commit('bonusUnits', success)
            } catch (error) {

            }
        },

    },
    getters: {
        bonusUnits (state) {
            return state.bonusUnits
        },
        bonusUnitIcons (state) {
            return state.bonusUnitIcons
        },
        unitTypesEnum (state) {
            return state.unitTypesEnum
        },
    },
}
