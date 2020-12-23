"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apiClient = _interopRequireDefault(require("@/api/api-client"));

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  namespaced: true,
  state: {
    messages: {},
    unreadMessages: {},
    loading: false,
    loadingMessagePage: false,
    isAllMessagesLoaded: false,
    typing: {},
    recipients: [],
    topics: []
  },
  mutations: {
    clearState: function clearState(state) {
      state.loading = false;
      state.typing = {};
      state.recipients = [];
      state.topics = [];
    },
    loading: function loading(state, payload) {
      state.loading = payload;
    },
    loadingMessagePage: function loadingMessagePage(state, payload) {
      state.loadingMessagePage = payload;
    },
    typing: function typing(state, payload) {
      state.typing = payload;
    },
    recipients: function recipients(state, payload) {
      state.recipients = payload;
    },
    messages: function messages(state, _messages) {
      // const
      // let messages = {}
      // если сообщения уже загружены
      // if (state.messages[conversationId]) { messages = state.messages[conversationId] }
      _messages.forEach(function (item) {
        if (!state.messages[item.conversation_id]) _vue["default"].set(state.messages, item.conversation_id, {});

        _vue["default"].set(state.messages[item.conversation_id], item.id, item);
      }); // ключ = id чата
      // Vue.set(state.messages, conversationId, messages)

    },
    isAllMessagesLoaded: function isAllMessagesLoaded(state, payload) {
      state.isAllMessagesLoaded = payload;
    },
    unreadMessages: function unreadMessages(state, payload) {
      var messages = {};
      payload.forEach(function (item) {
        return _vue["default"].set(messages, item.id, item);
      }); // ключ = id чата

      _vue["default"].set(state.unreadMessages, payload.conversation_id, messages);
    },
    addInMessages: function addInMessages(state, payload) {
      // console.log('payload')
      // console.log(payload)
      var conversationId = payload.conversation_id;

      if (state.messages[conversationId]) {
        state.messages[conversationId][payload.id] = payload;
      } else {
        state.messages[conversationId] = {};
        state.messages[conversationId][payload.id] = payload;
      } // обновление реактивности


      state.messages = Object.assign({}, state.messages);
    },
    updateInMessages: function updateInMessages(state, payload) {
      var conversationId = payload.conversation_id;

      if (state.messages && state.messages[conversationId]) {
        state.messages[conversationId][payload.id] = payload;
        state.messages = Object.assign({}, state.messages);
      }
    },
    deleteInMessages: function deleteInMessages(state, payload) {
      var conversationId = payload.conversation_id;

      if (state.messages && state.messages[conversationId]) {
        delete state.messages[conversationId][payload.id]; // обновление реактивности

        state.messages = Object.assign({}, state.messages);
      }
    }
  },
  actions: {
    status: function status(_ref, payload) {
      var rootGetters = _ref.rootGetters,
          state = _ref.state;
      if (!payload || !Array.isArray(payload)) return; // payload - array
      // const conversationId = payload.conversation_id

      payload.forEach(function (item) {
        // если send_type = null
        var conversationId = item.conversation_id;

        if (!item.send_type) {
          if (state.messages[conversationId]) {
            state.messages[conversationId][item.id] = item;
          } else {
            state.messages[conversationId] = {};
            state.messages[conversationId][item.id] = item;
          }
        }

        if (item.send_type === 'ALL') {
          if (state.messages[conversationId]) {
            state.messages[conversationId][item.id] = item;
          } else {
            state.messages[conversationId] = {};
            state.messages[conversationId][item.id] = item;
          }
        }

        if (item.send_type === 'RECEPIENTS') {
          var chatUserId = rootGetters['chat/chatUser/chatUser'].id;
          var recipient = item.recipients.filter(function (item) {
            return item === chatUserId;
          });

          if (recipient.length) {
            if (state.messages[conversationId]) {
              state.messages[conversationId][item.id] = item;
            } else {
              state.messages[conversationId] = {};
              state.messages[conversationId][item.id] = item;
            }
          }
        }
      }); // обновление реактивности

      state.messages = Object.assign({}, state.messages);
    },
    toDelivered: function toDelivered(_ref2, conversationId) {
      var dispatch = _ref2.dispatch,
          commit = _ref2.commit,
          state = _ref2.state,
          rootGetters = _ref2.rootGetters;
      var chatUser = rootGetters['chat/chatUser/chatUser'];
      var toDelivered = [];
      var id = null;
      var senderId = null;
      var delivered = null;

      for (var item in state.messages[conversationId]) {
        id = state.messages[conversationId][item].id;
        senderId = state.messages[conversationId][item].sender_id;
        delivered = state.messages[conversationId][item].delivered;
        if (chatUser.id !== senderId && delivered == null) toDelivered.push(id);
      }

      if (toDelivered.length) {
        var _delivered = {
          conversation_id: conversationId,
          messages: toDelivered
        };
        dispatch('deliveredStatus', _delivered);
      }
    },
    toRead: function toRead(_ref3, conversationId) {
      var dispatch = _ref3.dispatch,
          commit = _ref3.commit,
          state = _ref3.state,
          rootGetters = _ref3.rootGetters;
      var chatUser = rootGetters['chat/chatUser/chatUser'];
      var toRead = [];
      var msgId = null;
      var senderId = null;
      var read = null;

      for (var item in state.messages[conversationId]) {
        msgId = state.messages[conversationId][item].id; // id отправителя

        senderId = state.messages[conversationId][item].sender_id;
        read = state.messages[conversationId][item].read;
        if (!read && chatUser.id !== senderId) toRead.push(msgId);
      }

      if (toRead.length) {
        var _read = {
          conversation_id: conversationId,
          messages: toRead
        };
        dispatch('readStatus', _read);
      }
    },
    list: function list(_ref4, item) {
      var dispatch, commit, state, rootState, rootGetters, id, offset, limit, result, keys, last;
      return regeneratorRuntime.async(function list$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dispatch = _ref4.dispatch, commit = _ref4.commit, state = _ref4.state, rootState = _ref4.rootState, rootGetters = _ref4.rootGetters;
              id = item.id;
              offset = item.offset;
              limit = item.limit;
              _context.next = 6;
              return regeneratorRuntime.awrap(_apiClient["default"].get("/api/message/listWithAttachments?conversation_id=".concat(id, "&offset=").concat(offset, "&limit=").concat(limit)));

            case 6:
              result = _context.sent;

              if (!result.length) {
                commit('isAllMessagesLoaded', true);
              }

              commit('messages', result); // добавляем в последнее сообщение в список чатов

              if (id && state.messages[id]) {
                keys = Object.keys(state.messages[id]);
                last = state.messages[id][keys[keys.length - 1]];
                commit('chat/conversation/addInLast', last, {
                  root: true
                });
              } // delivered


              dispatch('toDelivered', id);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    typing: function typing(_ref5, _typing) {
      var commit, rootState;
      return regeneratorRuntime.async(function typing$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              commit = _ref5.commit, rootState = _ref5.rootState;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].get('/api/message/typing?conversation_id=' + _typing));

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    send: function send(_ref6, _ref7) {
      var commit, rootState, type, message, result;
      return regeneratorRuntime.async(function send$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              commit = _ref6.commit, rootState = _ref6.rootState;
              type = _ref7.type, message = _ref7.message;
              commit('loading', true);
              result = null;

              if (!(type === 'send')) {
                _context3.next = 8;
                break;
              }

              _context3.next = 7;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/message/send', message, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }));

            case 7:
              result = _context3.sent;

            case 8:
              if (!(type === 'reply')) {
                _context3.next = 12;
                break;
              }

              _context3.next = 11;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/message/reply', message));

            case 11:
              result = _context3.sent;

            case 12:
              if (!(type === 'forward')) {
                _context3.next = 16;
                break;
              }

              _context3.next = 15;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/message/forward', message));

            case 15:
              result = _context3.sent;

            case 16:
              /// /console.log('/api/message/send')
              /// /console.log(success)
              // добавляем новое сообщение в массив сообщений
              commit('addInMessages', result); // добавляем новое сообщение как последнее в списке чатов

              commit('chat/conversation/addInLast', result, {
                root: true
              });
              commit('loading', false);

            case 19:
            case "end":
              return _context3.stop();
          }
        }
      });
    },
    deliveredStatus: function deliveredStatus(_ref8, delivered) {
      var dispatch, commit, rootState, result;
      return regeneratorRuntime.async(function deliveredStatus$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              dispatch = _ref8.dispatch, commit = _ref8.commit, rootState = _ref8.rootState;
              _context4.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/message/delivered', delivered));

            case 3:
              result = _context4.sent;
              // console.log('deliveredStatus')
              // console.log(success)
              // подставляем id чата
              // result.conversation_id = delivered.conversation_id
              dispatch('status', result);

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      });
    },
    readStatus: function readStatus(_ref9, read) {
      var dispatch, commit, rootState, result;
      return regeneratorRuntime.async(function readStatus$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              dispatch = _ref9.dispatch, commit = _ref9.commit, rootState = _ref9.rootState;
              _context5.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/message/read', read));

            case 3:
              result = _context5.sent;
              // console.log('readStatus')
              // console.log(success)
              // подставляем id чата
              // result.conversation_id = read.conversation_id
              dispatch('status', result);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      });
    },
    update: function update(_ref10, message) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function update$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              commit = _ref10.commit, rootState = _ref10.rootState;
              _context6.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/message/update', message));

            case 3:
              result = _context6.sent;
              /// /console.log('/api/message/update')
              /// /console.log(success)
              // обновляем сообщение в массиве сообщений
              commit('updateInMessages', result);

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      });
    },
    "delete": function _delete(_ref11, message) {
      var commit, result;
      return regeneratorRuntime.async(function _delete$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              commit = _ref11.commit;
              _context7.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/message/delete', message));

            case 3:
              result = _context7.sent;
              console.log('delete', message, result); /// /console.log('/api/message/delete')
              /// /console.log(success)
              // удаляем сообщение из массива сообщений

              commit('deleteInMessages', result);

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      });
    },
    deleteAll: function deleteAll(_ref12, message) {
      var commit, result;
      return regeneratorRuntime.async(function deleteAll$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              commit = _ref12.commit;
              _context8.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/message/delete/all', message));

            case 3:
              result = _context8.sent;
              commit('deleteInMessages', result);
              console.log('deleteAll', message, result); /// /console.log('/api/message/delete/all')
              /// /console.log(success)
              // удаляем сообщение из массива сообщений

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      });
    }
  },
  getters: {
    messages: function messages(state) {
      return state.messages;
    },
    loading: function loading(state) {
      return state.loading;
    },
    loadingMessagePage: function loadingMessagePage(state) {
      return state.loadingMessagePage;
    },
    typing: function typing(state) {
      return state.typing;
    },
    recipients: function recipients(state) {
      return state.recipients;
    },
    isAllMessagesLoaded: function isAllMessagesLoaded(state) {
      return state.isAllMessagesLoaded;
    }
  }
};
exports["default"] = _default;