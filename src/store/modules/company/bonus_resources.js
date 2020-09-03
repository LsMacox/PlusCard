import ApiService from '@/api/api-client'

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
        async get_list ({ commit }, id) {
            ApiService
                .get(
                    `/api-cabinet/program/bonus_resources/list?program_id=${id}`,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                )
                .then((response) => {
                    /// /console.log('brand/bonus_resources/get_list')
                    /// /console.log(response.data.data)
                    commit('bonusResources', response.data.data)
                })
                .catch((error) => {
                    if (error.response) {
                        /// /console.log(JSON.stringify(error.response.data));
                    }
                })
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
        activeBonusResources (state) {
            return state.activeBonusResources
        },
        activeBonusResourcesShort (state) {
            return state.activeBonusResourcesShort
        },
    },
}
