import ApiService from '@/api/api-client'
import Vue from 'vue'

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
        updateBonusResources (state, newItem) {
            const index = state.bonusResources.findIndex(
                (x) => x.id === newItem.id,
            )
            Vue.set(state.bonusResources, index, newItem)
        },
        addBonusResources (state, newItem) {
            state.bonusResources.push(newItem)
        },
        removeBonusResources (state, id) {
            const index = state.bonusResources.findIndex((x) => x.id === id)
            state.bonusResources.splice(index, 1)
        },
    },
    actions: {
        async GetList ({ commit }, programId) {
            const result = await ApiService.get(`/api-cabinet/program/bonus_resources/list?program_id=${programId}`)

            commit('bonusResources', result)
        },
        async get_active_list ({ commit }, id) {
            ApiService
                .get(
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
          const response = await ApiService.get('/api-cabinet/program/bonus/resource/list/short?program_id=' + id)
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
            return state.bonusResources.filter(item => item.rules &&
                item.rules.event === 'App\\Events\\AccountBuyEvent')
        },
        activeBonusResources (state) {
            return state.activeBonusResources
        },
        activeBonusResourcesShort (state) {
            return state.activeBonusResourcesShort
        },
    },
}
