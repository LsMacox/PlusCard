import ApiService from '@/api/api-client'
import Vue from 'vue'

const getDefaultState = () => {
  return {
    openNavigationSetting: false,
    integrations: [],
    updateIntegration: null,
    scopes: [],
    scopes_cachedAt: null,
  }
}
export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    openNavigationConfiguring (state, payload) {
      state.openNavigationSetting = payload
    },
    ADD_INTEGRATION (state, payload) {
      state.integrations.push(payload)
    },
    setUpdateIntegration (state, payload) {
      state.updateIntegration = payload
    },
    SET_INTEGRATIONS (state, payload) {
      state.integrations = payload
    },
    UPDATE_INTEGRATION (state, payload) {
      var index = state.integrations.findIndex(x => x.id === payload.id)
      if (index >= 0) Vue.set(state.integrations, index, payload)
    },
    UPDATE_STATUS_INTEGRATION (state, payload) {
      var index = state.integrations.findIndex(x => x.id === payload.id)
      if (index >= 0) {
        state.integrations[index].revoked = payload.revoked
      }
    },
    REMOVE_INTEGRATION (state, id) {
      var index = state.integrations.findIndex(x => x.id === id)
      if (index >= 0) state.integrations.splice(index, 1)
    },
    SET_SCOPES (state, payload) {
      state.scopes = payload
      state.scopes_cachedAt = Date.now()
    },
  },
  actions: {
    async GetClients ({ commit, dispatch, rootState }, programId) {
      const result = await ApiService.get(`/oauth/program/${programId}/clients`)
      commit('SET_INTEGRATIONS', result)
    },

    async GetScopes ({ commit, dispatch, state }, { cacheTTL = this._vm.$config.app.cacheTTL }) {
      // cacheTTL: null - unlimit, <=0 - no cache, >0 - cacheTTL in seconds
      if (state.scopes_cachedAt && (cacheTTL === null || state.scopes_cachedAt + cacheTTL * 1000 > Date.now())) {
        console.log('getCached')
        return state.scopes
      }

      const result = await ApiService.get('/oauth/scopes')
      commit('SET_SCOPES', result)
      return result
    },

    async CreateIntegration ({ commit, dispatch, rootState }, newClient) {
      const result = await ApiService.post(
        `/oauth/program/${newClient.program_id}/clients`,
        newClient,
      )
      commit('ADD_INTEGRATION', result)
      return result
    },

    async UpdateIntegration ({ commit, dispatch, rootState }, client) {
      const result = await ApiService.put(
        `/oauth/program/${client.program_id}/clients/${client.id}`,
        client,
      )
      commit('UPDATE_INTEGRATION', result)
      return result
    },

    async RemoveIntegration ({ commit, dispatch, rootState }, { programId, clientId }) {
      const result = await ApiService.delete(`/oauth/program/${programId}/clients/${clientId}`)
      commit('REMOVE_INTEGRATION', clientId)
      return result
    },
    async SetRevokedClient ({ commit }, client) {
      const result = await ApiService.put(`/oauth/clients/${client.id}/revoked`,
        { revoked: client.revoked },
      )
      commit('UPDATE_STATUS_INTEGRATION', client)
      return result
    },
  },
  getters: {
    getOpenNavigationConfiguring (state) {
      return state.openNavigationSetting
    },
    getCreateConfiguringIntegrations (state) {
      return state.integrations
    },
    getCurrentIntegrationUpdate (state) {
      return state.updateIntegration
    },
    scopes (state) {
      return state.scopes
    },
  },
}