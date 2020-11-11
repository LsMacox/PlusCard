import ApiService from '@/api/api-client'
import User from '@/models/user'


const getDefaultState = () => {
  return {
    profile: new User({}),
    profileOld: {},
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => Object.assign(state, getDefaultState()),
  SET_PROFILE (state, payload) {
    state.profile = new User(payload)
  },
}

const actions = {
  resetState ({ commit }) {
    commit('RESET_STATE')
  },
  list ({ commit }, value) {
    commit('SET_DRAWER', value)
  },

  async read ({ commit, state }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.get('/api-cabinet/profile')
      // console.log(result)
      commit('SET_PROFILE', result)
    } catch (error) {
      throw error
    }
  },

  async update ({ dispatch, commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.post('/api-cabinet/profile', item)
      console.log(result)
      commit('SET_PROFILE', result.data.data)
      dispatch('ShowNotify', {
        title: 'Профиль пользователя',
        message: 'Профиль успешно изменен',
        type: 'success',
      }, { root: true })
    } catch (error) {
      throw error
    }
  },
}

const getters = {
  profile: state => state.profile,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
