import ApiService from '@/api/api-client'
import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        bonusUnits: [],
        bonusUnits_cachedAt: null,
        bonusUnitIcons: [],
        unitTypesEnum: [
            {
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
            state.bonusUnits_cachedAt = Date.now()
        },
        bonusUnitIcons (state, payload) {
            state.bonusUnitIcons = payload
        },
        ADD_BONUS_UNIT (state, payload) {
            if (payload.is_main) {
                state.bonusUnits.forEach((element) => {
                    element.is_main = false
                })
            }
            state.bonusUnits.push(payload)
        },
        UPDATE_BONUS_UNIT (state, payload) {
            const index = state.bonusUnits.findIndex(
                (x) => x.id === payload.id,
            )
            if (index >= 0) {
                if (payload.is_main) {
                    state.bonusUnits.forEach((element) => {
                        element.is_main = false
                    })
                }
                Vue.set(state.bonusUnits, index, payload)
            }
        },
        REMOVE_BONUS_UNIT (state, id) {
            const index = state.bonusUnits.findIndex((x) => x.id === id)
            state.bonusUnits.splice(index, 1)
        },
    },
    actions: {

        async getBonusUnitIcons ({ commit, dispatch }) {
            const result = await ApiService.get(
                '/api-cabinet/bonus_units/icons',
            )
            commit('bonusUnitIcons', result)
        },

        async createBonusUnit ({ commit }, bonusUnit) {
            const result = await ApiService.post(
                '/api-cabinet/bonus_units/create',
                bonusUnit,
            )
            commit('ADD_BONUS_UNIT', result)
            this._vm.$notify({
                title: 'Создание бонусной валюты',
                text: 'Валюта успешно создана!',
                type: 'success',
            })
        },
        async updateBonusUnit ({ commit }, bonusUnit) {
            const result = await ApiService.post(
                '/api-cabinet/bonus_units/update',
                bonusUnit,
            )
            commit('UPDATE_BONUS_UNIT', result)
            this._vm.$notify({
                title: 'Обновление бонусной валюты',
                text: 'Валюта успешно обновлена!',
                type: 'success',
            })
        },
        async deleteBonusUnit ({ commit }, bonusUnitId) {
            await ApiService.delete(
                `/api-cabinet/bonus_units/delete?id=${bonusUnitId}`,
            )
            commit('REMOVE_BONUS_UNIT', bonusUnitId)
            this._vm.$notify({
                title: 'Удаление бонусной валюты',
                text: 'Валюта успешно удалена!',
                type: 'success',
            })
        },

        // READ
        async loadBonusUnits ({ commit, dispatch }, programId) {
            const success = await ApiService.get(
                `/api-cabinet/bonus_units/list?program_id=${programId}`,
            )
            console.log(`/api-cabinet/bonus_units/list?program_id=${programId}`)
            console.log(success)
            commit('bonusUnits', success)
        },
    },
    getters: {
        bonusUnits (state) {
            return state.bonusUnits
        },
        activeBonusUnits (state) {
            return state.bonusUnits.filter((x) => x.deleted_at === null)
        },
        mainBonusUnit (state) {
            const index = state.bonusUnits.findIndex((x) => !!x.is_main)
            return index >= 0 ? state.bonusUnits[index] : null
        },
        bonusUnitIcons (state) {
            return state.bonusUnitIcons
        },
        unitTypesEnum (state) {
            return state.unitTypesEnum
        },
    },
}
