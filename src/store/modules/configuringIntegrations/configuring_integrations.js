
const getDefaultState = () => {
  return {
    openNavigationSetting: false,
    integration: [],
    updateIntegration: {},
    checkStatus: false,
  }
}
export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    openNavigationConfiguring (state, payload) {
      state.openNavigationSetting = payload
    },
    createConfiguringIntegrations (state, payload) {
      state.integration.push(payload)
    },
    setUpdateIntegration (state, payload) {
      state.updateIntegration = payload
    },
    updateCurrentIntegration (state, payload) {
      state.integration = payload
    },
    checkUpdate (state, payload) {
      state.checkStatus = payload
    },
  },
  getters: {
    getOpenNavigationConfiguring (state) {
      return state.openNavigationSetting
    },
    getCreateConfiguringIntegrations (state) {
      return state.integration
    },
    getCurrentIntegrationUpdate (state) {
      return state.updateIntegration
    },
    getCheckUpdate (state) {
      return state.checkStatus
    },
  },
}
