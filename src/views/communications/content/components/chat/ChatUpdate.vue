<template>
  <v-dialog
    v-model="dialog"
    class="dialog-chat-update"
    custom-class="app--modal"
  >
    <v-skeleton-loader
      :loading="loading"
      type="image"
    >
      <div

        class="modal"
      >
        <div class="header">
          Редактирование чата
        </div>

        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          @submit.prevent.native="submit('form')"
        >
          <div class="content">
            <el-form-item prop="name">
              <v-text-field
                v-model="form.name"
                placeholder="Введите название чата"
              />
            </el-form-item>

            <!-- все получатели -->
            <div style="display: flex;">
              <div class="name-all">
                Участники чата
              </div>
              <v-spacer />
              <v-btn
                color="primary"
                small
                @click="openAdd()"
              >
                Добавить участника
              </v-btn>
            </div>

            <!-- список получателей -->
            <div
              v-for="(client, i) in clients"
              :key="i"
            >
              <div
                v-if="client.active"
                class="res-row"
              >
                <div
                  class="avatar"
                  :style="'background: url(' + client.avatar + ');'"
                />
                <div class="name">
                  {{ client.name }}
                </div>
                <div
                  v-if="!isPrivateChat && chatUser.id !== client.id"
                  class="remove-link"
                  @click="openRemove(client)"
                >
                  удалить
                </div>
              </div>
            </div>
          </div>

          <div class="action">
            <v-btn
              @click="close()"
            >
              Отмена
            </v-btn>

            <v-spacer />

            <v-btn
              color="primary"
              :loading="conversationUpdateLoading"
              :disabled="!members.length"
              @click="submit('form')"
            >
              Обновить
            </v-btn>
          </div>
        </el-form>
      </div>
    </v-skeleton-loader>

    <add-member
      v-if="dialogAdd"
      :dialog.sync="dialogAdd"
    />

    <remove-member
      v-if="dialogRemove"
      :dialog.sync="dialogRemove"
      :conversation-id="editedConversation.id"
      :item="editedItem"
    />
  </v-dialog>
</template>

<script>
  import AddMember from './AddMember'
  import RemoveMember from './RemoveMember'

  export default {
    components: {
      AddMember,
      RemoveMember,
    },
    props: {
      dialog: Boolean,
      item: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        dialogAdd: false,
        dialogRemove: false,
        editedItem: {},
        form: {
          id: null,
          name: null,
        },
        loading: false,
        checkAll: false,
        members: [],
        rules: {
          name: [
            { required: true, message: 'Название чата обязательно', trigger: 'blur' },
            { max: 100, message: 'Название чата не должен быть более 100 символов', trigger: 'blur' },
          ],
        },
      }
    },
    computed: {

      loadingSend () {
        return this.$store.getters['chat/message/loading']
      },
      programId () {
        return this.$store.getters['brand/program/programId']
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      editedConversation () {
        return this.$store.getters['chat/conversation/editedConversation']
      },
      isPrivateChat () {
        const activeMembers = this.editedConversation.members.filter(item => item.active)
        if (activeMembers.length === 1 || activeMembers.length === 2) return true
        return false
      },
      clients () {
        return this.editedConversation.members
      },
    },
    watch: {
      members (val) {
        if (val && val.length === this.clients.length) this.checkAll = true
        else this.checkAll = false
      },
    },
    async created () {
      this.$store.commit('chat/conversation/editedConversation', this.item)
      this.form.id = this.editedConversation.id
      this.form.name = this.editedConversation.name
      this.members = Object.assign([], this.clients)
    },
    methods: {
      close () {
        this.members = []
        this.$emit('update:dialog', false)
      },
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },

      /*
       * ПОЛУЧАТЕЛИ
       */

      setRecipientAll () {
        if (this.members.length === this.clients.length) {
          this.members = []
        } else {
          this.members = Object.assign([], this.clients)
        }
      },
      setRecipient (item) {
        let check = false
        let index = null
        this.members.forEach((recipient, i) => {
          if (recipient.id === item.id) {
            check = true
            index = i
          }
        })
        if (check) this.members.splice(index, 1)
        else this.members.push(item)
      },
      isRecipient (item) {
        const check = this.members.filter(recipient => recipient.id === item.id)
        if (check.length) return true
        return false
      },
      submit (formRef) {
        this.$refs[formRef].validate((v) => {
          if (v) this.update()
          else return false
        })
      },
      update () {
        const conversation = {
          conversation_id: this.form.id,
          name: this.form.name,
        }
        /// /console.log(conversation)
        this.conversationUpdateLoading = true
        this.$store.dispatch('chat/conversation/update', conversation).then(() => {
          this.close()
        }).finally(() => {
          this.conversationUpdateLoading = false
        })
      },
      openAdd () {
        this.dialogAdd = true
      },
      openRemove (item) {
        this.editedItem = item
        this.dialogRemove = true
      },
    },
  }
</script>
