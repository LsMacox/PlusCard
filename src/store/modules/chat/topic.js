import ApiService from '@/api/api-client'

export default {
  namespaced: true,
  state: {
    topics: [],
    selectedTopicId: null,
    nameExist: false,
  },
  mutations: {
    clearState (state) {
      state.topics = []
      state.selectedTopicId = null
    },
    topics (state, payload) {
      state.topics = payload
    },
    selectedTopicId (state, payload) {
      state.selectedTopicId = payload
    },
    addInTopics (state, payload) {
      state.topics.push(payload)
    },
    updateInTopics (state, payload) {
      state.topics.forEach(function (topic, index) {
        if (topic.id === payload.id) Object.assign(state.topics[index], payload)
      })
    },
    deleteInTopics (state, payload) {
      state.topics.forEach(function (topic, index) {
        if (topic.id === payload) state.topics.splice(index, 1)
      })
    },
    nameExist (state, payload) {
      state.nameExist = payload
    },
  },
  actions: {
    async create ({ commit, rootState, dispatch }, topic) {
      const result = await ApiService.post('/api/conversation/topic/add', topic)
      /// /console.log('topic/create')
      /// /console.log(success)

      commit('addInTopics', result)
    },

    async list ({ commit, rootState }, conversationId) {
      try {
        const result = await ApiService.get(
          '/api/conversation/topic/list?conversation_id=' + conversationId,
        )
        /// ///console.log('topic/list')
        /// ///console.log(success)

        // подставляем в ответ id чата
        commit('topics', result)
      } catch (error) {
        // console.log(error)
      }
    },

    async update ({ commit, rootState, dispatch }, topic) {
      const result = await ApiService.post(
        '/api/conversation/topic/update',
        topic,
      )
      /// ///console.log('/api/conversation/topic/update')
      /// ///console.log(success)

      // обновляем сообщение в массиве сообщений
      commit('updateInTopics', result)
    },

    async delete ({ commit, rootState, dispatch }, topicId) {
      await ApiService.delete('/api/conversation/topic?id=' + topicId)
      /// ///console.log('topic/delete')
      /// ///console.log(success)

      // удаляем сообщение из массива сообщений
      commit('deleteInTopics', topicId)
    },

    async nameValidation ({ commit, rootState }, topic) {
      const result = await ApiService.post(
        '/api/conversation/topic/check',
        topic,
      )
      /// ///console.log('/api/conversation/topic/check')
      /// ///console.log(success)

      // статус валидации
      if (result) {
        commit('nameExist', result.is_exist)
      } else {
        commit('nameExist', true)
      }
    },
  },
  getters: {
    topics (state) {
      return state.topics.sort((a, b) => {
        if (a.name > b.name) return 1 // если первое значение больше второго
        if (a.name === b.name) return 0 // если равны
        if (a.name < b.name) return -1 // если первое значение меньше второго
      })
    },
    selectedTopicId (state) {
      return state.selectedTopicId
    },
    nameExist (state) {
      return state.nameExist
    },
  },
}
