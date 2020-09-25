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
      const items = state.staff
      items.forEach((item, index) => {
        if (item.id === payload.id) Object.assign(items[index], payload)
      })
  },
  REMOVE_FROM_STAFF (state, payload) {
    const items = state.staff
    items.forEach((item, index) => {
      if (item.id === payload.id) items.splice(index, 1)
    })
  },
}

const actions = {

  resetState ({ commit }) {
    commit('RESET_STATE')
  },

  async invite ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.post('/api-cabinet/staff', item)
      console.log('/api-cabinet/staff')
      console.log(result)
      commit('UPDATE_IN_STAFF', result)

      this._vm.$notify({
        type: 'success',
        title: 'Сотрудник приглашен',
        text: 'Вы успешно пригласили сотрудника',
      })
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

  async update ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.put('/api-cabinet/staff', item)
      console.log('/api-cabinet/staff')
      console.log(result)
      commit('UPDATE_IN_STAFF', result)

      this._vm.$notify({
        type: 'success',
        title: 'Роль обновлена',
        text: 'Роль сотрудника успешно обновлена',
      })
    } catch (error) {
      throw error
    }
  },

  async delete ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.delete(`/api-cabinet/staff?user_id=${item.id}`)
      console.log('/api-cabinet/staff')
      console.log(result)
      commit('REMOVE_FROM_STAFF', item)

      this._vm.$notify({
        type: 'success',
        title: 'Сотрудник удален',
        text: 'Сотрудник успешно удален',
      })
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
