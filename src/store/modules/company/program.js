import ApiService from '@/api/api-client'
import VueSession from '@/utils/session'

const getDefaultState = () => {
  return {
    programs: [], // компании продавца
    program: VueSession.get('program'), // сокращенная модель программы
    programModel: {
      socials: {
        vk: null,
        youtube: null,
        facebook: null,
        instagram: null,
      },
    }, // полная модель редактируемой программы
    shops: [], // торговые точки
    // -2 все окна закрыты
    // -1 открыто окно новой торговой точки
    shopIndex: -2, // индекс открытого окна торговой точки
    editedShop: { // редактируемая торговая точка
      name: '',
      city: '',
      address: '',
      phone: '',
      coords: [],
      lat: '',
      lng: '',
      workTimes: [
        {
          startTime: '',
          endTime: '',
          days: [],
          breakStart: '',
          breakEnd: '',
        },
      ],
    },
    mapCenter: [53.757592, 87.136173],
    fullAddress: false,
    addressErrors: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => Object.assign(state, getDefaultState()),
  SET_PROGRAMS: (state, payload) => state.programs = payload,
  SET_SHOP_INDEX: (state, payload) => state.shopIndex = payload,
  SET_EDITED_SHOP: (state, payload) => state.editedShop = payload,
  SET_MAP_CENTER: (state, payload) => state.mapCenter = payload,
  SET_FULL_ADDRESS: (state, payload) => state.fullAddress = payload,
  SET_ADDRESS_ERRORS: (state, payload) => state.addressErrors = payload,
  SET_PROGRAM (state, payload) {
    state.program = payload
    VueSession.set('program', payload)
  },
  SET_FRIST_PROGRAM (state) {
    let program = null
    if (state.programs && state.programs.length > 0) {
      program = state.programs[0]
    }

    state.program = program
    VueSession.set('program', program)
  },
  DELETE_PROGRAM (state, id) {
    const index = state.programs.findIndex(x => x.id === id)
    if (index >= 0) {
      state.programs.splice(index, 1)
    }
  },
  SET_PROGRAM_MODEL (state, payload) {
    if (payload.current_moderations && payload.current_moderations.length) {
      payload.current_moderations.forEach(moderation => {
        moderation.fields.forEach(field => {
          if (field.name === 'socials') payload[field.name] = JSON.parse(field.new)
          else payload[field.name] = field.new
        })
      })
    }
    state.programModel = payload
  },
  ADD_IN_PROGRAMS (state, payload) {
    const items = state.programs
    items.push(payload)
  },
  UPDATE_IN_PROGRAMS (state, payload) {
    const items = state.programs
    items.forEach((item, index) => {
      if (item.id === payload.id) Object.assign(items[index], payload)
    })
  },
  SET_SHOPS (state, payload) {
    state.shops = payload
  },
  ADD_IN_SHOPS (state, payload) {
    const items = state.shops
    items.push(payload)
  },
  UPDATE_IN_SHOPS (state, payload) {
    const items = state.shops
    items.forEach((item, index) => {
      if (item.id === payload.id) Object.assign(items[index], payload)
    })
  },
  REMOVE_IN_SHOPS (state, payload) {
    const items = state.shops
    items.forEach((item, index) => {
      if (item.id === payload.id) items.splice(index, 1)
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

  async setModeration ({ commit }, item) {
    const result = await ApiService.put('/api-cabinet/company/moderation', item)
    // console.log('brand/company/setModeration')
    // console.log(success)
    commit('SET_PROGRAM', result)
    this._vm.$notify({
      type: 'success',
      title: 'Настройка компании',
      text: 'Компания отправлена на модерацию',
    })
  },

  async Delete ({ commit }, programId) {
     await ApiService.delete('/api-cabinet/company/delete', {
        params: {
          program_id: programId,
        },
      })

      commit('DELETE_PROGRAM', programId)
      commit('SET_FRIST_PROGRAM')

      this._vm.$notify({
        type: 'success',
        title: 'Удаление компании',
        text: 'Компания успешно удалена',
      })
  },

  async updateInfo ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.put('/api-cabinet/company/info2', item)
      // console.log('/api-cabinet/company/info2')
      // console.log(result)
      commit('SET_PROGRAM_MODEL', result)
      commit('UPDATE_IN_PROGRAMS', result)

      this._vm.$notify({
        type: 'success',
        title: 'Компания обновлена',
        text: 'Информация о компании успешно обновлена',
      })
    } catch (error) {
      throw error
    }
  },

  async createShop ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.post('/api-cabinet/company/shop', item)
      console.log('/api-cabinet/company/shop')
      console.log(result)
      commit('ADD_IN_SHOPS', result)

      this._vm.$notify({
        type: 'success',
        title: 'Компания обновлена',
        text: 'Торговая точка компании успешно добавлена',
      })
    } catch (error) {
      throw error
    }
  },

  async listShop ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.get(`/api-cabinet/company/shop/list?program_id=${item.id}`)
      console.log(`/api-cabinet/company/shop/list?program_id=${item.id}`)
      console.log(result)
      commit('SET_SHOPS', result)
    } catch (error) {
      throw error
    }
  },

  async updateShop ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.put('/api-cabinet/company/shop', item)
      console.log('/api-cabinet/company/shop')
      console.log(result)
      commit('UPDATE_IN_SHOPS', result)

      this._vm.$notify({
        type: 'success',
        title: 'Компания обновлена',
        text: 'Торговая точка успешно обновлена',
      })
    } catch (error) {
      throw error
    }
  },

  async deleteShop ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.delete(`/api-cabinet/company/shop?id=${item.id}`)
      console.log(`/api-cabinet/company/shop?id=${item.id}`)
      console.log(result)
      commit('REMOVE_IN_SHOPS', result)

      this._vm.$notify({
        type: 'success',
        title: 'Компания обновлена',
        text: 'Торговая точка успешно удалена',
      })
    } catch (error) {
      throw error
    }
  },

  async updateContact ({ commit }, item) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await ApiService.put('/api-cabinet/company/contact', item)
      // console.log('/api-cabinet/company/contact')
      // console.log(result)
      commit('SET_PROGRAM_MODEL', result)
      commit('UPDATE_IN_PROGRAMS', result)

      this._vm.$notify({
        type: 'success',
        title: 'Компания обновлена',
        text: 'Контакты компании успешно обновлены',
      })
    } catch (error) {
      throw error
    }
  },

}

const getters = {
  programs: state => state.programs,
  program: state => state.program,
  programId: state => state.program ? state.program.id : null,
  programModel: state => state.programModel,
  menu: state => {
    return [
      { id: 'info', name: 'Общая информация', route: `/company/${state.programModel.id}/info` },
      { id: 'shop', name: 'Точки продаж', route: `/company/${state.programModel.id}/shop` },
      { id: 'contact', name: 'Контактные данные', route: `/company/${state.programModel.id}/contact` },
    ]
  },
  shops: state => state.shops,
  shopIndex: state => state.shopIndex,
  editedShop: state => state.editedShop,
  defaultShop: () => {
    const defState = getDefaultState()
    return JSON.parse(JSON.stringify(defState.editedShop))
  },
  mapCenter: state => state.mapCenter,
  fullAddress: state => state.fullAddress,
  addressErrors: state => state.addressErrors,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
