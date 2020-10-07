import ApiService from '@/api/api-client'
import Vue from 'vue'

import { EVENTS_ENUM } from '@/models/enums'

function eventFilter(event) {
    return (item) => {
        return item.rules && item.rules.event === event
    }
}

export default {
    namespaced: true,
    state: {
        bonusResources: [],
        activeBonusResources: [],
        activeBonusResourcesShort: [],        
    },
    mutations: {
        clearState (state) {
            state.bonusResources = []
        },
        bonusResources (state, payload) {
            state.bonusResources = payload
        },
        activeBonusResources (state, payload) {
            state.activeBonusResources = payload
        },
        activeBonusResourcesShort (state, payload) {
            state.activeBonusResourcesShort = payload
        },
        UPDATE_BONUS_RESOURCE (state, newItem) {
            const index = state.bonusResources.findIndex(
                (x) => x.id === newItem.id,
            )
            Vue.set(state.bonusResources, index, newItem)
        },
        ADD_BONUS_RESOURCE (state, newItem) {
            state.bonusResources.push(newItem)
        },
        REMOVE_BONUS_RESOURCE (state, id) {
            const index = state.bonusResources.findIndex((x) => x.id === id)
            state.bonusResources.splice(index, 1)
        },
    },
    actions: {
        async GetList ({ commit }, programId) {
            const result = await ApiService.get(
                `/api-cabinet/program/bonus/resource/list/short?program_id=${programId}`,
            )

            commit('bonusResources', result)
        },

        async DeleteBonusRes ({ commit }, id) {
            await ApiService.delete(
                `/api-cabinet/program/bonus_resources/delete?id=${id}`,
            )

            commit('REMOVE_BONUS_RESOURCE', id)

            this._vm.$notify({
                title: 'Удаление бонусной операции',
                text: 'Бонусная операция успешно удалена',
                type: 'success',
            })
        },
        async CreateBonusRes ({ commit }, { bonusRes, silent }) {
            const result = await ApiService.post(
                '/api-cabinet/program/bonus_resources/add',
                bonusRes,
            )

            commit('ADD_BONUS_RESOURCE', result)
            if (!silent) {
                this._vm.$notify({
                    title: 'Создание бонусной операции',
                    text: `Бонусная операция "${result.title}" успешно создана`,
                    type: 'success',
                })
            }
        },
        async UpdateBonusRes ({ commit }, { bonusRes, silent }) {
            const result = await ApiService.post(
                '/api-cabinet/program/bonus_resources/update',
                bonusRes,
            )

            commit('UPDATE_BONUS_RESOURCE', result)
            if (!silent) {
                this._vm.$notify({
                    title: 'Обновление бонусной операции',
                    text: `Бонусная операция "${result.title}" успешно обновлена`,
                    type: 'success',
                })
            }
        },
        async get_active_list ({ commit }, id) {
            ApiService.get(
                `/api-cabinet/program/bonus_resources/list?program_id=${id}&active=1`,
            )
                .then((response) => {
                    commit('activeBonusResources', response.data.data)
                })
                .catch((error) => {
                    if (error.response) {
                        /// /console.log(JSON.stringify(error.response.data));
                    }
                })
        },
        async GetActiveShortList ({ commit }, id) {
            const response = await ApiService.get(
                '/api-cabinet/program/bonus/resource/list/short?program_id=' +
                    id,
            )
            // console.log('GetActiveShortList')
            // console.log(response)
            commit('activeBonusResourcesShort', response)
            return response
        },
    },
    getters: {
        bonusResources (state) {
            return state.bonusResources
        },
        buyBonusRes (state) {
            return state.bonusResources.filter(eventFilter(EVENTS_ENUM.AccountBuyEvent))
             
        },
        newAccountBonusRes (state) {
            return state.bonusResources.filter(eventFilter(EVENTS_ENUM.AccountFirstEmissionEvent))
        },
        birthDayBonusRes (state) {
            return state.bonusResources.filter(eventFilter(EVENTS_ENUM.AccountClientBirthDayEvent))              
        },
        buyBonusResActive (state, getters) {
            return getters.buyBonusRes.filter(
                (item) => item.bonus_score && item.bonus_score.active,
            )
        },
        existsBuyBonusResActive (state, getters) {
            return getters.buyBonusResActive.length > 0
        },
        //
        activeBonusResources (state) {
            return state.activeBonusResources
        },
        activeBonusResourcesShort (state) {
            return state.activeBonusResourcesShort
        },
    },
}
