const state = {
    loadingApp: false, // отправка запроса
    loadingRequest: false, // отправка запроса
    drawer: localStorage.getItem('drawer')
        ? JSON.parse(localStorage.getItem('drawer'))
        : false, // переключатель меню
}

const mutations = {
    // eslint-disable-next-line no-return-assign
    LOADING_APP: (state, value) => (state.loadingApp = value),
    // eslint-disable-next-line no-return-assign
    LOADING_REQUEST: (state, value) => (state.loadingRequest = value),
    SET_DRAWER (state, payload) {
        state.drawer = payload
        localStorage.setItem('drawer', JSON.stringify(payload))
    },
}

const actions = {
    ResetProgram ({ commit }, value) {
        commit('SET_PROGRAM', null)
    },
    changeDrawer ({ commit }, value) {
        commit('SET_DRAWER', value)
    },
    setLoadingApp ({ commit }, value) {
        commit('LOADING_APP', value)
    },
    async SocketOn ({ rootGetters, dispatch, commit }, data) {
      try {
        console.log('socketOn', data)
        // console.log(data)

        // токен чат-пользователя для операций с чатами
        const currentConversationId =
            rootGetters['chat/conversation/currentConversationId']

        // подтверждение получение данных
        if (
            JSON.stringify(data) !== '{}' &&
            data.command !== '/connect/redis'
        ) {
            if (data.redis_queue !== ':typing') {
                const confirm = {
                    redis_queue: data.redis_queue,
                    // channel_user_id: data.channel_user_id,
                    guid: data.guid,
                    confirm: true,
                }
                dispatch('auth/redis/confirm', confirm, { root: true })
            }
        }

        /*
         * MESSAGE
         */

        // получили сообщение
        if (data.command === '/message/send') {
            const message = data.data.data

            // добавляем новое сообщение в массив сообщений
            commit('chat/message/addInMessages', message, { root: true })

            // добавляем новое сообщение как последнее в списке чатов
            commit('chat/conversation/addInLast', message, { root: true })

            // отправляем на отметку delivered
            const conversationId = message.conversation_id
            const delivered = {
                conversation_id: conversationId,
                messages: [message.id],
            }
            dispatch('chat/message/deliveredStatus', delivered, { root: true })

            // отправляем на отметку read

            // если активный диалог
            if (conversationId === currentConversationId) {
                const read = {
                    conversation_id: conversationId,
                    messages: [message.id],
                }
                dispatch('chat/message/readStatus', read, { root: true })
                // добавляем в unread_count
            } else {
                commit(
                    'chat/conversation/addUnreadCount',
                    conversationId,
                    { root: true })
            }
        }

        // обновляем статус delivered в messages
        if (data.command === '/message/delivered') {
            const messages = data.data.data

            // обновляем статус
            if (messages.length) {
                const conversationId = messages[0].conversation_id
                const delivered = {
                    conversation_id: conversationId,
                    data: messages,
                }
                dispatch('chat/message/status', delivered, { root: true })
            }
        }

        // обновляем статус read в messages
        if (data.command === '/message/read') {
            const messages = data.data.data

            // обновляем статус
            if (messages.length) {
                const conversationId = messages[0].conversation_id

                // если активный диалог
                if (conversationId === currentConversationId) {
                    const read = {
                        conversation_id: conversationId,
                        data: messages,
                    }
                    dispatch('chat/message/status', read, { root: true })
                }
            }
        }

        // обновляем сообщение в массиве messages
        if (data.command === '/message/update') {
            const message = data.data.data
            commit('chat/message/updateInMessages', message, { root: true })
        }

        // удаляем сообщение из массива messages
        if (data.command === '/message/delete/all') {
            const message = data.data.data
            commit('chat/message/deleteInMessages', message, { root: true })
        }

        // событие typing
        if (data.command === '/message/typing') {
            const typingEvent = data.data.data
            const typing = {
                conversation_id: typingEvent.conversation_id,
                sender_id: typingEvent.sender_id,
            }
            commit('chat/message/typing', typing, { root: true })
        }

        /*
         * CONVERSATION
         */

        // событие conversation/create
        if (data.command === '/conversation/create') {
            const conversationId = data.data.data.id
            dispatch('chat/conversation/read', conversationId, { root: true })
                .then(() => {
                    const conversation = {
                        id: conversationId,
                        offset: 0,
                        limit: 20,
                    }

                    dispatch('chat/message/list', conversation, { root: true })
                })
        }

        // событие conversation/update
        if (data.command === '/conversation/update') {
            const conversationId = data.data.data.id
            dispatch('chat/conversation/read', conversationId, { root: true })
        }

        // событие conversation/delete
        if (data.command === '/conversation/delete') {
            const conversationId = data.data.data.id
            commit(
                'chat/conversation/deleteInConversations',
                conversationId, { root: true },
            )
            if (currentConversationId === conversationId) {
                commit('chat/conversation/conversationSort', null, { root: true })
            }
        }
      } catch (error) {
        console.error('SocketOn', error)
      }
    },
    async SocketConnect ({ dispatch }) {
      // слушаем канал system
      console.log('window.socket', window.socket)
      window.socket.on('system', (data) => {
        console.log('socket.on.system', data)
        dispatch('SocketOn', data)
      })
      // redis reconnect
      window.socket.on('reconnect', (attemptNumber) => {
          console.log(
              'Socket reconnect after attempt = ' + attemptNumber,
          )
          dispatch('auth/redis/connect', null, { root: true })
      })
    },
    async LoadingApp ({ state, commit, dispatch }) {
        try {
            console.log('<LoadingApp>')
            commit('LOADING_APP', true)

            await dispatch('auth/auth/loadingApp', null, { root: true })
            await dispatch('SocketConnect', null)
            
            console.log('status=ok')
        } catch (error) {
            console.log('loading error', error)
        } finally {
            commit('LOADING_APP', false)
            console.log('</LoadingApp>')
        }
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}
