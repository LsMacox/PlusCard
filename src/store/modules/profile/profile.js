import ApiService from '@/api/api-client'

class User {
  constructor (profile) {
    Object.assign(this, profile)
  }

  hasProgramPermission (program_id, permission) {
    if (this.access_programs) {
      const programIndex = this.access_programs.findIndex(x => x.id === program_id)
      if (programIndex >= 0) {
        const program = this.access_programs[programIndex]
        for (let i = 0; i < program.roles.length; i++) {
          const permIndex = program.roles[i].permissions.findIndex(x => x.name === permission)
          if (permIndex >= 0) return true
        }
      }
    }
    return false
  }

  hasProgramRole (program_id, role) {
    if (this.access_programs) {
      const programIndex = this.access_programs.findIndex(x => x.id === program_id)
      if (programIndex >= 0) {
        const program = this.access_programs[programIndex]
        const roleIndex = program.roles.findIndex(x => x.name === role)
        if (roleIndex >= 0) return true
      }
    }
    return false
  }

  hasProgramAnyRole (program_id, roles) {
    for (let i = 0; i < roles.length; i++) {
      const hasRole = this.hasProgramRole(program_id, roles[i])
      if (hasRole) return true
    }
    return false
  }
}

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
