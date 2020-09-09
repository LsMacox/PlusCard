<template>
  <v-dialog
    v-model="dialog"
    custom-class="app--modal"
  >
    <div class="modal">
      <div class="header">
        Список получателей
      </div>

      <div class="content">
        <el-button
          class="content-input"
          type="primary"
          size="medium"
          icon="el-icon-plus"
          @click="openCreate()"
        >
          Новая группа
        </el-button>

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
                check
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
          <div class="app--spacer" />
          <div
            v-if="item.entity_type === 'GROUP'"
            class="update"
            @click="openUpdate(item)"
          >
            <i class="el-icon-edit" />
          </div>
          <div
            v-if="item.entity_type === 'GROUP'"
            class="delete"
            @click="openDelete(item)"
          >
            <i class="el-icon-delete" />
          </div>
        </div>
      </div>

      <div class="action">
        <el-button
          size="medium"
          @click="close"
        >
          Сброс и отмена
        </el-button>

        <div class="app--spacer" />

        <el-button
          type="primary"
          size="medium"
          :disabled="!recipients.length"
          @click="save"
        >
          Выбрать
        </el-button>
      </div>

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

      <delete
        v-if="deleteDialog"
        :dialog.sync="deleteDialog"
        :item="editedItem"
      />
    </div>
  </v-dialog>
</template>

<script>
  import Create from './Create'
  import Update from './Update'
  import Delete from './Delete'

  export default {
    components: {
      Create,
      Update,
      Delete,

    },
    props: [
      'dialog',
      'conversationId',
    ],
    data () {
      return {
        createDialog: false,
        updateDialog: false,
        deleteDialog: false,
        editedItem: {},
        selectedItem: [],
      }
    },
    computed: {
      loadingRequest () {
        return this.$store.getters['template/shared/loadingRequest']
      },
      loadingSend () {
        return this.$store.getters['chat/message/loading']
      },
      colors () {
        return this.$store.getters['template/colors/colors']
      },
      conversation () {
        const conversation = this.$store.getters['chat/conversation/conversations'].filter(item => item.id == this.conversationId)
        if (conversation.length) return conversation[0]
        return {}
      },
      members () {
        let members = []
        const chatUser = this.$store.getters['chat/chatUser/chatUser']
        if (this.conversation && this.conversation.members) {
          members = this.conversation.members.filter(item => {
            if (item.id != chatUser.id && item.active) return item
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
            if (item.id != chatUser.id && item.active) {
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

<style lang="scss" scoped>
@import "@/styles/components/_modal.scss";

.modal {
    min-width: 600px;
}

.content {
    margin: 0 0 20px 0;
    padding: 0 !important;
    max-height: 60vh;
    overflow-y: auto;
}

/* RECIPIENTS */

.res-row {
    display: flex;
    margin: 5px 0;
}

.check-all {
    margin-bottom: 15px;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    border: 1px solid rgba(51, 51, 51, .3);
    cursor: pointer;
}

.check-all-back {
    width: 28px;
    height: 28px;
    border-radius: 30px;
    background-color: #24D3ED;
    padding: 2px;
}

.name-all {
    padding: 4px 10px;
    font-weight: 900;
}

.line-h {
    position: relative;
    width: 15px;
    height: 1px;
    margin: 14px 0 14px 15px;
    background-color: rgba(51, 51, 51, .3);
}

.line-v {
    position: absolute;
    bottom: -14px;
    right: 0;
    width: 1px;
    height: 35px;
    margin: 0 14px 15px 14px;
    background-color: rgba(51, 51, 51, .3);
}

.check {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    border: 1px solid rgba(51, 51, 51, .3);
    cursor: pointer;
}

.avatar-user {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    margin-left: 10px;
    background-position: center !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
}

.avatar-group {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    margin-left: 10px;
    font-size: 20px;
    font-weight: 900;
    text-transform: uppercase;
    text-align: center;
    color: #90A4AE;
    border: 1px solid #CFD8DC;
}

.name {
    padding: 5px 10px;
}

.type {
    padding: 5px 0;
}

.update {
    margin: 0 15px 0 0;
    font-size: 20px;
    color: #409eff;
    cursor: pointer;
}

.delete {
    font-size: 20px;
    color: #F56C6C;
    cursor: pointer;
}

.content-input {
    position: absolute;
    top: -54px;
    left: 200px;
}

/* MEDIA */
/* EXTRA SMALL */
@media (max-width: 600px) {

}

/* SMALL */
@media (min-width: 600px) and (max-width: 959.8px) {

}

/* MEDIUM */
@media (min-width: 960px) and (max-width: 1263.8px) {

}

/* LARGE */
@media (min-width: 1264px) and (max-width: 1903.8px) {

}

/* X LARGE */
@media (min-width: 1904px) {

}
</style>
