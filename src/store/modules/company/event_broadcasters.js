import ApiService from '@/api/api-client'
import Vue from 'vue'

import { EVENTS_ENUM } from '@/models/enums'

function eventFilter (event) {
    return (item) => {
        return item.rules && item.rules.event === event
    }
}
function activeFilter (active) {
    return (item) => {
        return item.bonus_score && item.bonus_score.active === active
    }
}

export default {
    namespaced: true,
    state: {
        broadcasters: [],       
    },
    mutations: {        
        SET_BROADCASTERS (state, payload) {
            state.broadcasters = payload
        },      
              ADD_BROADCASTER (state, newItem) {
            state.broadcasters.push(newItem)
        },
        REMOVE_BROADCASTER (state, id) {
            const index = state.broadcasters.findIndex((x) => x.id === id)
            state.broadcasters.splice(index, 1)
        },
    },
    actions: {
        async GetList ({ commit }, programId) {
            const result = await ApiService.get(
                `/api-cabinet/program/account/event/broadcaster/list?program_id=${programId}`,
            )            
            commit('SET_BROADCASTERS', result)
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
        async SetActiveResource ({ state, commit }, { event, programId, active }) {
            const bonusResIds = state.bonusResources
                .filter(x => x.program_id === programId)
                .filter(eventFilter(event))
                .map(x => x.id)
                console.log('bonusResIds', bonusResIds)
            if (bonusResIds.length === 0) {
               throw Error('Включение не возможно: требуется заполнить блок')
            }

            await ApiService.post(
                '/api-cabinet/program/bonus_resources/active/set',
                {
                    ids: bonusResIds,
                    program_id: programId,
                    active,
                },
            )

            for (let index = 0; index < bonusResIds.length; index++) {
                const id = bonusResIds[index]
                commit('UPDATE_BONUS_RESOURCE_ACTIVE', { id, active })
            }

            this._vm.$notify({
                title: 'Бонусная механика',
                text: `Бонусная механика ${active ? 'включена' : 'выключена'}`,
                type: 'success',
            })
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

        FilterBonusRes ({ state }, { event, active }) {
            console.log('FilterBonusRes')
            return state.bonusResources.filter(eventFilter(event)).filter(activeFilter(active))
        },
    },
    getters: {
        broadcasters (state) {
            return state.broadcasters
        },       
    },
}
