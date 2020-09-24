import ApiService from '@/api/api-client'

const getDefaultState = () => {
  return {
    roles: [],
    staff: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => Object.assign(state, getDefaultState()),
  SET_ROLES (state, payload) {
    state.roles = payload
  },
  SET_STAFF (state, payload) {
    state.staff = payload
  },
  UPDATE_IN_STAFF (state, payload) {
    state.staff.forEach((item, i, items) => {
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

  async create ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.post('/api-cabinet/staff', item)
      console.log('/api-cabinet/staff')
      console.log(result)
      commit('UPDATE_IN_STAFF', result)
    } catch (error) {
      throw error
    }
  },

  async roles ({ commit }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.get('/api-cabinet/staff/roles')
      console.log('/api-cabinet/staff/roles')
      console.log(result)
      commit('SET_ROLES', result)
    } catch (error) {
      throw error
    }
  },

  async list ({ commit }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.get('/api-cabinet/staff/list')
      console.log('/api-cabinet/staff/list')
      console.log(result)
      commit('SET_STAFF', result)
    } catch (error) {
      throw error
    }
  },

}

const getters = {
  roles: state => state.roles,
  staff: state => state.staff,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
