import ApiService from '@/api/api-client'
import VueSession from '@/utils/session'

const getDefaultState = () => {
  return {
    programs: [], // компании продавца
    program: VueSession.get('program'), // сокращенная модель программы
    programModel: {}, // полная модель редактируемой программы
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => Object.assign(state, getDefaultState()),
  SET_PROGRAMS (state, payload) {
    state.programs = payload
  },
  SET_PROGRAM (state, payload) {
    state.program = payload
    VueSession.set('program', payload)
  },
  SET_PROGRAM_MODEL (state, payload) {
    state.programModel = payload
  },
  UPDATE_IN_PROGRAMS (state, payload) {
    state.programs.forEach((item, i, items) => {
      if (item.id === payload.id) {
        items[i] = payload
      }
    })
  },
}

const actions = {

  resetState ({ commit }) {
    commit('RESET_STATE')
  },

  async list ({ commit }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.get('/api-cabinet/company/list')
      // console.log(result)
      commit('SET_PROGRAMS', result)
      if (result && result.length) {
        if (!VueSession.get('program')) {
          commit('SET_PROGRAM', result[0])
          VueSession.set('program', result[0])
        }
      }
    } catch (error) {
      throw error
    }
  },

  async read ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.get(`/api-cabinet/company?id=${item.id}`)
      // console.log(`/api-cabinet/company?id=${item.id}`)
      // console.log(result)
      commit('SET_PROGRAM_MODEL', result)
    } catch (error) {
      throw error
    }
  },

  async updateInfo ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.put('/api-cabinet/company/info2', item)
      // console.log('/api-cabinet/company/info2')
      // console.log(result)
      commit('SET_PROGRAM_MODEL', result)
      commit('UPDATE_IN_PROGRAMS', result)
    } catch (error) {
      throw error
    }
  },

  async updateShop ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.put('/api-cabinet/company/info2', item)
      // console.log('/api-cabinet/company/info2')
      // console.log(result)
      commit('SET_PROGRAM_MODEL', result)
      commit('UPDATE_IN_PROGRAMS', result)
    } catch (error) {
      throw error
    }
  },

}

const getters = {
  programs: state => state.programs,
  program: state => state.program,
  programModel: state => state.programModel,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
