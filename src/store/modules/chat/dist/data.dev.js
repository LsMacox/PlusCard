"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  namespaced: true,
  getters: {
    payload: function payload(state, getters, rootState, rootGetters) {
      return function (convId) {
        var payload = {
          profile: rootGetters.user,
          conversation: getters.conversation(convId),
          conversationProgram: getters.conversationProgram(convId),
          members: getters.members(convId),
          employees: getters.employees(convId),
          chatUser: rootGetters['chat/chatUser/chatUser']
        };
        return payload;
      };
    },
    conversation: function conversation(state, getters, rootState, rootGetters) {
      return function (convId) {
        var conversation = rootGetters['chat/conversation/conversations'].filter(function (item) {
          return item.id === convId;
        });

        if (!isEmptyObject(conversation)) {
          return conversation[0];
        }

        return {};
      };
    },
    conversationProgram: function conversationProgram(state, getters) {
      return function (convId) {
        var conversation = getters.conversation(convId);

        if (!isEmptyObject(conversation)) {
          return conversation.program;
        }

        return {};
      };
    },
    realChatName: function realChatName(state, getters) {
      return function (convId) {
        var conversationProgram = getters.conversationProgram(convId);

        if (!isEmptyObject(conversationProgram)) {
          return conversationProgram.real_chat_name;
        }

        return '';
      };
    },
    members: function members(state, getters) {
      return function (convId) {
        var conversation = getters.conversation(convId);
        if (!isEmptyObject(conversation)) return conversation.members || [];
        return [];
      };
    },
    activeMembers: function activeMembers(state, getters) {
      return function (convId) {
        var conversation = getters.conversation(convId);
        if (!isEmptyObject(conversation)) return conversation.members.filter(function (item) {
          return item.active;
        });
        return [];
      };
    },
    employees: function employees(state, getters) {
      return function (convId) {
        var conversationProgram = getters.conversationProgram(convId);

        if (!isEmptyObject(conversationProgram)) {
          return conversationProgram.chat_members || [];
        }

        return [];
      };
    }
  }
};
exports["default"] = _default;

function isEmptyObject(obj) {
  return Object.keys(obj).length <= 0;
}