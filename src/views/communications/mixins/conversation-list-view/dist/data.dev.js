"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  computed: {
    isGroup: function isGroup() {
      return this.activeMembers.length > 2;
    },
    profile: function profile() {
      return this.$store.getters.user;
    },
    program: function program() {
      return this.$store.getters.program;
    },
    typing: function typing() {
      return this.$store.getters['chat/message/typing'];
    },
    payload: function payload() {
      return this.$store.getters['chat/data/payload'](this.conversationId);
    },
    chatUser: function chatUser() {
      return this.$store.getters['chat/chatUser/chatUser'];
    },
    activeMembers: function activeMembers() {
      return this.$store.getters['chat/data/activeMembers'](this.conversationId);
    },
    conversation: function conversation() {
      return this.$store.getters['chat/data/conversation'](this.conversationId);
    },
    members: function members() {
      return this.$store.getters['chat/data/members'](this.conversationId);
    },
    conversationProgram: function conversationProgram() {
      return this.$store.getters['chat/data/conversationProgram'](this.conversationId);
    },
    employees: function employees() {
      return this.$store.getters['chat/data/employees'](this.conversationId);
    },
    realChatName: function realChatName() {
      return this.$store.getters['chat/data/realChatName'](this.conversationId);
    },
    messages: function messages() {
      return this.$store.getters['chat/message/messages'][this.conversationId];
    }
  }
};
exports["default"] = _default;