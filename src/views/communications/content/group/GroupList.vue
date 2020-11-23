<template>
  <v-dialog
    v-model="dialog"
    class="dialog-group-list"
    max-width="500px"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar color="info">
        <v-toolbar-title>Список получателей</v-toolbar-title>

        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            @click="close()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-divider />
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <!-- список получателей -->
              <div
                v-for="(item, i) in groups"
                :key="i"
                class="res-row"
              >
                <div
                  class="check"
                  @click="setRecipient(item)"
                >
                  <div
                    v-show="isSelected(item)"
                    class="check-all-back"
                  >
                    <v-icon color="white">
                      fa-check
                    </v-icon>
                  </div>
                </div>

                <div
                  v-if="item.entity_type === 'USER'"
                  class="avatar-user"
                  :style="'background: url(' + item.avatar + ');'"
                />
                <div
                  v-else
                  class="avatar-group"
                >
                  {{ item.name.charAt(0) }}
                </div>

                <div class="name">
                  {{ item.name }}
                </div>
                <div class="type">
                  {{ getType(item.entity_type) }}
                </div>
                <v-spacer />
                <div
                  v-if="item.entity_type === 'GROUP'"
                  class="update"
                  @click="openUpdate(item)"
                >
                  <v-icon color="primary">
                    fa-edit
                  </v-icon>
                </div>

                <div
                  v-if="item.entity_type === 'GROUP'"
                  href="deleteBtn"
                  class="delete"
                  @click="openDelete(item)"
                >
                  <v-icon color="error">
                    fa-trash
                  </v-icon>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="primary"
                @click="openCreate()"
              >
                <v-icon left>
                  fa-plus
                </v-icon>
                Новая группа
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          text
          @click="close()"
        >
          Сброс и отмена
        </v-btn>

        <v-spacer />

        <v-btn
          color="primary"
          :disabled="!recipients.length"
          @click="save()"
        >
          Выбрать
        </v-btn>
      </v-card-actions>
    </v-card>

    <create
      v-if="createDialog"
      :dialog.sync="createDialog"
      :conversation-id="conversationId"
    />

    <update
      v-if="updateDialog"
      :dialog.sync="updateDialog"
      :conversation-id="conversationId"
      :item="editedItem"
    />

    <base-confirm-dialog
      v-model="deleteDialog"
      title="Удалить группу?"
      :message=" 'Название: ' + editedItem.name "
      confirm-button-text="Удалить"
      @confirm="remove(editedItem.id)"
    />
  </v-dialog>
</template>

<script>
  import Create from './GroupCreate'
  import Update from './GroupUpdate'

  export default {
    components: {
      Create,
      Update,
    },
    props: {
      dialog: {
        type: Boolean,
        default: false,
      },
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    data () {
      return {
        createDialog: false,
        updateDialog: false,
        deleteDialog: false,
        editedItem: {},
        selectedItem: [],
        groupDeleteAction: false,
      }
    },
    computed: {
      loadingRequest () {
        return this.$store.getters['template/shared/loadingRequest']
      },
      loadingSend () {
        return this.$store.getters['chat/message/loading']
      },
      conversation () {
        const conversation = this.$store.getters['chat/conversation/conversations'].filter(item => item.id === this.conversationId)
        if (conversation.length) return conversation[0]
        return {}
      },
      members () {
        let members = []
        const chatUser = this.$store.getters['chat/chatUser/chatUser']
        if (this.conversation && this.conversation.members) {
          members = this.conversation.members.filter(item => {
            if (item.id !== chatUser.id && item.active) return item
          })
        }
        return members
      },
      groups () {
        let list = []
        const chatUser = this.$store.getters['chat/chatUser/chatUser']
        const conversation = this.conversation
        const groups = this.$store.getters['chat/group/groups']

        // добавляем участников
        if (conversation && conversation.members) {
          conversation.members.sort((a, b) => a.name - b.name)

          list = conversation.members.filter(item => {
            if (item.id !== chatUser.id && item.active) {
              item.entity_type = 'USER'
              return item
            }
          })
        }

        // добавляем группы получателей
        groups.sort((a, b) => b.name - a.name)

        groups.forEach(item => {
          item.entity_type = 'GROUP'
          list.unshift(item)
        })

        return list
      },
      recipients: {
        get () {
          return this.$store.getters['chat/message/recipients']
        },
        set (val) {
          this.$store.commit('chat/message/recipients', val)
        },
      },
    },
    methods: {

      remove (groupId) {
        const group = {
          id: groupId,
        }
        /// /console.log(group)
        this.groupDeleteAction = true
        this.$store.dispatch('chat/group/delete', group).then(() => {
          // this.close()
        }).finally(() => {
          this.groupDeleteAction = false
        })
      },
      close () {
        this.recipients = []
        this.selectedItem = []
        this.$emit('update:dialog', false)
      },
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      getType (type) {
        if (type === 'USER') return '(участник)'
        if (type === 'GROUP') return '(группа)'
        return ''
      },
      openCreate () {
        this.createDialog = true
      },
      openUpdate (item) {
        this.editedItem = Object.assign({}, item)
        this.updateDialog = true
      },
      openDelete (item) {
        this.editedItem = Object.assign({}, item)
        this.deleteDialog = true
      },

      /*
       * ПОЛУЧАТЕЛИ
       */

      setRecipientAll () {
        if (this.recipients.length === this.totalMembers) {
          this.recipients = []
        } else {
          this.groups.forEach(item => {
            if (item.entity_type === 'USER') {
              if (this.recipients.indexOf(item.id) === -1) this.recipients.push(item.id)
            }
            if (item.entity_type === 'GROUP') {
              item.members.forEach(item => {
                if (this.recipients.indexOf(item.id) === -1) this.recipients.push(item.id)
              })
            }
          })
        }
      },
      setRecipient (entity) {
        // список выбранных сущностей
        let check = false
        let index = null
        this.selectedItem.forEach((item, i) => {
          if (item.id === entity.id && item.entity_type === entity.entity_type) {
            check = true
            index = i
          }
        })

        if (check) {
          this.selectedItem.splice(index, 1)

          if (entity.entity_type === 'USER') {
            if (this.recipients.indexOf(entity.id) !== -1) this.recipients.splice(this.recipients.indexOf(entity.id), 1)
          }
          if (entity.entity_type === 'GROUP') {
            entity.members.forEach(item => {
              if (this.recipients.indexOf(item.id) !== -1) {
                this.recipients.splice(this.recipients.indexOf(item.id), 1)
              }
            })
          }
        } else {
          this.selectedItem.push({
            id: entity.id,
            entity_type: entity.entity_type,
          })

          // добавление/удаление в массиве recipients
          if (entity.entity_type === 'USER') {
            this.recipients.push(entity.id)
          }
          if (entity.entity_type === 'GROUP') {
            entity.members.forEach(item => {
              this.recipients.push(item.id)
            })
          }
        }
      },
      isSelected (entity) {
        const check = this.selectedItem.filter(item => (item.id === entity.id && item.entity_type === entity.entity_type))
        if (check.length) return true
        return false
      },
      save () {
        this.$emit('update:dialog', false)
      },
    },
  }
</script>
