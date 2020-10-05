
import ApiService from '@/api/api-client'

const getDefaultState = () => {
  return {
    openNavigationBonuses: false,
    bonusesItems: [],
    bonusesItem: {},
    accrualBonuses: [], // BonusUnits
    magazineBonuses: [],
    updateWhatSelectItem: {},
  }
}
export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    openNavigationCreateBonuses (state, payload) {
      state.openNavigationBonuses = payload
    },
    createBonusesItem (state, payload) {
      state.bonusesItems.push(payload)
    },
    createAccrualBonuses (state, payload) {
      state.accrualBonuses.push(payload)
    },
    createMagazineBonuses (state, payload) {
      state.magazineBonuses.push(payload)
    },
    updateBonusesItem (state, payload) {
      state.bonusesItem = payload
    },
    updateWhatSelect (state, payload) {
      state.updateWhatSelectItem = payload
    },
    resetState (state) {
      Object.assign(state, getDefaultState())
    },
  },
  actions: {
    
  },
  getters: {
    getBonusesItems (state) {
      return state.bonusesItems
    },
    getOpenNavigationCreateBonuses (state) {
      return state.openNavigationBonuses
    },
    getAccrualBonuses (state) {
      return state.accrualBonuses
    },
    getMagazineBonuses (state) {
      return state.magazineBonuses
    },
    getUpdateBonusesItem (state) {
      return state.bonusesItem
    },
    getWhatSelect (state) {
      return state.updateWhatSelectItem
    },
  },
}
