import ApiService from '@/api/api-client'
import Vue from 'vue'

const getDefaultState = () => {
  return {
    certificates: [],
    category_id_list: [],
    tags_id_list: [],
    moderation_fields: [],
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    RESET_STATE (state) {
      Object.assign(state, getDefaultState())
    },
    CATEGORY_ID_LIST (state, payload) {
      state.category_id_list = payload
    },
    SET_TAGS_LIST (state, payload) {
      state.tags_id_list = payload
    },
    ADD_TAG (state, tag) {
      var index = state.tags_id_list.findIndex(x => x.name === tag.name)
      if (index < 0) {
        state.tags_id_list.push(tag)
        return tag
      } else {
        return state.tags_id_list[index]
      }
    },
    CERTIFICATES (state, payload) {
      state.certificates = payload
    },
    ADD_CERTIFICATE (state, payload) {
      state.certificates.push(payload)
    },
    UPDATE_CERTIFICATE (state, payload) {
      var index = state.certificates.findIndex(x => x.id === payload.id)
      Vue.set(state.certificates, index, payload)
    },
    ADD_CERTIFICATE_NOMINAL (state, nominal) {
      var index = state.certificates.findIndex(
        x => x.id === nominal.certificate_id,
      )
      if (index >= 0) {
        state.certificates[index].nominals.push(nominal)
        if (state.certificates[index].quantity != null) {
          state.certificates[index].nominals_quantity += nominal.quantity
        }
      }
    },
    REMOVE_CERTIFICATE_NOMINAL (state, nominal) {
      var index = state.certificates.findIndex(
        x => x.id === nominal.certificate_id,
      )
      if (index >= 0) {
        const nominalIndex = state.certificates[index].nominals.findIndex(
          x => x.id === nominal.id,
        )
        if (nominalIndex >= 0) {
          state.certificates[index].nominals.splice(nominalIndex, 1)
          if (state.certificates[index].quantity != null) {
            state.certificates[index].nominals_quantity -= nominal.quantity
          }
        }
      }
    },
    UPDATE_STATUS_CERTIFICATE (state, payload) {
      var index = state.certificates.findIndex(x => x.id === payload.id)
      state.certificates[index].active = payload.active
    },
    REMOVE_CERTIFICATE (state, id) {
      var index = state.certificates.findIndex(x => x.id === id)
      state.certificates.splice(index, 1)
    },
    ACTUAL_MODER_FIELDS (state, payload) {
      state.moderation_fields = payload
    },
  },
  actions: {
    Reset ({ commit }) {
      commit('RESET_STATE')
    },

    async GetList ({ commit }, programId) {
      const result = await ApiService.get(
        '/api-cabinet/program/certificates/list',
        {
          program_id: programId,
        },
      )
      commit('CERTIFICATES', result)
    },

    async DeleteCert ({ commit }, cert) {
      await ApiService.delete('/api-cabinet/program/certificates/delete', {
        id: cert.id,
        force: cert.force ? 1 : 0,
      })
      commit('REMOVE_CERTIFICATES', cert.id)
    },

    async CreateCertificate ({ commit }, certificate) {
      const result = ApiService.post('/api-cabinet/program/certificates/create')
      commit('ADD_CERTIFICATE', result)
    },

    async AddCertificateNominal ({ commit }, nominal) {
      const result = await ApiService.post(
        '/api-cabinet/program/certificate/nominal',
        nominal,
      )
      commit('add_certificate_nominal', result)
      return result
    },

    async DeleteCertificateNominal ({ commit }, nominal) {
      await ApiService.delete(
        '/api-cabinet/program/certificate/nominal',
        {
          nominal_id: nominal.id,
          force: nominal.force,
        },
        { errorHandle: false },
      )
      commit('REMOVE_CERTIFICATE_NOMINAL', nominal)
      return true
    },

    async GetCategoryList ({ commit, dispatch }) {
      const result = await ApiService.get(
        '/api-cabinet/program/certificates/categories',
      )
      commit('CATEGORY_ID_LIST', result)
    },
    async GetTagsList ({ commit, dispatch }) {
      const result = await ApiService.get(
        '/api-cabinet/program/certificates/tags',
      )
      commit('SET_TAGS_LIST', result)
    },

    async get_actual_moder_fields ({ commit, dispatch }, certId) {
      // console.log("get_actual_moder_fields...");
      try {
        const success = await ApiService.get(
          '/api/program/certificates/actual_moder_fields',
          {
            params: {
              cert_id: certId,
            },
          },
        )
        commit('actual_moder_fields', success.data.data)
      } catch (error) {
        // console.log(error);
      }
    },
  },
  getters: {
    certificates (state) {
      return state.certificates
    },
    category_id_list (state) {
      return state.category_id_list
    },
    tags_id_list (state) {
      return state.tags_id_list
    },
    actual_moder_fields (state) {
      return state.moderation_fields
    },
  },
}
