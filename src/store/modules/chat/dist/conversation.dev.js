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
    loadingConversations: false,
    conversations: [],
    currentConversationType: 'business',
    currentConversationId: '',
    nowCreateConversation: {},
    editedConversation: {}
  },
  mutations: {
    clearState: function clearState(state) {
      state.conversations = [];
      state.editedConversation = {};
    },
    loadingConversations: function loadingConversations(state, payload) {
      state.loadingConversations = payload;
    },
    conversations: function conversations(state, payload) {
      state.conversations = payload;
    },
    merge_conversations: function merge_conversations(state, chatList) {
      chatList.forEach(function (chat) {
        var index = state.conversations.findIndex(function (item) {
          return item.id === chat.id;
        });

        if (index >= 0) {
          _vue["default"].set(state.conversations, index, chat);
        } else {
          state.conversations.push(chat);
        }
      });
    },
    currentConversationId: function currentConversationId(state, payload) {
      state.currentConversationId = payload;
    },
    nowCreateConversation: function nowCreateConversation(state, payload) {
      state.nowCreateConversation = payload;
    },
    currentConversationType: function currentConversationType(state, payload) {
      state.currentConversationType = payload;
    },
    editedConversation: function editedConversation(state, payload) {
      state.editedConversation = payload;
    },
    addInLast: function addInLast(state, payload) {
      var conversationId = payload.conversation_id;
      state.conversations.forEach(function (item) {
        if (item.id === conversationId) item.last_message = payload;
      });
      state.conversations = Object.assign([], state.conversations);
    },
    addUnreadCount: function addUnreadCount(state, id) {
      state.conversations.forEach(function (item) {
        if (item.id === id) item.unread_count++;
      });
      state.conversations = Object.assign([], state.conversations);
    },
    clearUnreadCount: function clearUnreadCount(state, id) {
      state.conversations.forEach(function (item) {
        if (item.id === id) item.unread_count = 0;
      });
      state.conversations = Object.assign([], state.conversations);
    },
    addInConversations: function addInConversations(state, payload) {
      var items = state.conversations;
      items.push(payload);
    },
    updateInConversations: function updateInConversations(state, payload) {
      var index = state.conversations.findIndex(function (item) {
        return item.id === payload.id;
      });

      if (index >= 0) {
        _vue["default"].set(state.conversations, index, payload);
      } else {
        state.conversations.push(payload);
      }
    },
    deleteInConversations: function deleteInConversations(state, payload) {
      var items = state.conversations;
      items.forEach(function (item, index) {
        if (item.id === payload.id) items.splice(index, 1);
      });
    },
    setCurrentConversationMessage: function setCurrentConversationMessage(state, payload) {
      var index = state.conversations.findIndex(function (item) {
        return item.id === state.currentConversationId;
      });

      if (index >= 0) {
        _vue["default"].set(state.conversations[index], 'currentTemplateMessage', payload);
      }
    }
  },
  actions: {
    create: function create(_ref, item) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref.commit, rootState = _ref.rootState;
              _context.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/conversation', item));

            case 3:
              result = _context.sent;
              console.log('create conversation', result);
              commit('nowCreateConversation', result);
              commit('addInConversations', result);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    list: function list(_ref2) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function list$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              commit = _ref2.commit, rootState = _ref2.rootState;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].get('/api/conversation/list'));

            case 3:
              result = _context2.sent;
              commit('conversations', result);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    GetBusinessChatList: function GetBusinessChatList(_ref3) {
      var commit,
          rootState,
          programId,
          result,
          _args3 = arguments;
      return regeneratorRuntime.async(function GetBusinessChatList$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              commit = _ref3.commit, rootState = _ref3.rootState;
              programId = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : null;
              _context3.next = 4;
              return regeneratorRuntime.awrap(_apiClient["default"].get("/api/conversation/getBusinessChats?program_id=".concat(programId)));

            case 4:
              result = _context3.sent;
              commit('merge_conversations', result);

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      });
    },
    GetMerchantChatList: function GetMerchantChatList(_ref4) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function GetMerchantChatList$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              commit = _ref4.commit, rootState = _ref4.rootState;
              _context4.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].get('/api/conversation/getMerchantChats'));

            case 3:
              result = _context4.sent;
              commit('merge_conversations', result);

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      });
    },
    read: function read(_ref5, conversationId) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function read$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              commit = _ref5.commit, rootState = _ref5.rootState;
              _context5.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].get('/api/conversation?id=' + conversationId));

            case 3:
              result = _context5.sent;
              commit('updateInConversations', result);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      });
    },
    update: function update(_ref6, item) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function update$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              commit = _ref6.commit, rootState = _ref6.rootState;
              _context6.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/conversation/admin', item));

            case 3:
              result = _context6.sent;
              commit('updateInConversations', result);

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      });
    },
    updateArchived: function updateArchived(_ref7, item) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function updateArchived$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              commit = _ref7.commit, rootState = _ref7.rootState;
              _context7.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/conversation/archived/update', item));

            case 3:
              result = _context7.sent;
              commit('updateInConversations', result);

            case 5:
            case "end":
              return _context7.stop();
          }
        }
      });
    },
    "delete": function _delete(_ref8, conversationId) {
      var commit, rootState;
      return regeneratorRuntime.async(function _delete$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              commit = _ref8.commit, rootState = _ref8.rootState;
              _context8.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/conversation/delete', {
                conversation_id: conversationId
              }));

            case 3:
              commit('deleteInConversations', conversationId);

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      });
    },
    chosenSet: function chosenSet(_ref9, item) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function chosenSet$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              commit = _ref9.commit, rootState = _ref9.rootState;
              _context9.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/conversation/chosen/set', item));

            case 3:
              result = _context9.sent;
              commit('updateInConversations', result);

            case 5:
            case "end":
              return _context9.stop();
          }
        }
      });
    },
    chosenRemove: function chosenRemove(_ref10, item) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function chosenRemove$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              commit = _ref10.commit, rootState = _ref10.rootState;
              _context10.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/conversation/chosen/remove', item));

            case 3:
              result = _context10.sent;
              commit('updateInConversations', result);

            case 5:
            case "end":
              return _context10.stop();
          }
        }
      });
    },
    mutedSet: function mutedSet(_ref11, item) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function mutedSet$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              commit = _ref11.commit, rootState = _ref11.rootState;
              _context11.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/conversation/muted/set', item));

            case 3:
              result = _context11.sent;
              commit('updateInConversations', result);

            case 5:
            case "end":
              return _context11.stop();
          }
        }
      });
    },
    mutedRemove: function mutedRemove(_ref12, item) {
      var commit, rootState, result;
      return regeneratorRuntime.async(function mutedRemove$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              commit = _ref12.commit, rootState = _ref12.rootState;
              _context12.next = 3;
              return regeneratorRuntime.awrap(_apiClient["default"].post('/api/conversation/muted/remove', item));

            case 3:
              result = _context12.sent;
              commit('updateInConversations', result);

            case 5:
            case "end":
              return _context12.stop();
          }
        }
      });
    }
  },
  getters: {
    loadingConversations: function loadingConversations(state) {
      return state.loadingConversations;
    },
    currentConversationType: function currentConversationType(state) {
      return state.currentConversationType;
    },
    currentConversationId: function currentConversationId(state) {
      return state.currentConversationId;
    },
    conversations: function conversations(state) {
      return state.conversations.map(function (item) {
        var activeMembers = item.members.filter(function (item) {
          return item.active;
        });

        _vue["default"].set(item, 'activeMembers', activeMembers);

        _vue["default"].set(item, 'activeMembersCount', activeMembers.length);

        return item;
      });
    },
    conversations_business: function conversations_business(state, getters) {
      return getters.conversations.filter(function (item) {
        return !!item.program_id;
      });
    },
    conversations_merchant: function conversations_merchant(state, getters) {
      return getters.conversations.filter(function (item) {
        return item.program_id == null;
      });
    },
    editedConversation: function editedConversation(state) {
      return state.editedConversation;
    },
    nowCreateConversation: function nowCreateConversation(state) {
      return state.nowCreateConversation;
    }
  }
};
exports["default"] = _default;