<template>
  <v-row class="row-send-bar">
    <!-- выбор тем -->
    <v-col
      cols="auto"
      align-self="center"
    >
      <v-menu
        v-if="members.length > 0"
        top
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="!selectedTopicId"
            color="primary"
            text
            v-on="on"
          >
            Выбрать тему
          </v-btn>
          <v-btn
            v-else
            color="primary"
            x-small
            v-on="on"
          >
            {{ getTopicName() }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in topics"
            :key="index"
            @click="setTopic(item.id)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setTopic(0)">
            <span style="color: #24D3ED;">Другая или новая тема</span>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>

    <v-col
      cols="auto"
      align-self="center"
    >
      <!-- выбор получателей -->
      <v-menu
        v-if="members.length > 0"
        top
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="!recipients.length"
            color="primary"
            text
            v-on="on"
          >
            Выбрать получателей
          </v-btn>
          <v-btn
            v-else
            color="primary"
            x-small
            v-on="on"
          >
            {{ getGroupCount(recipients) }} {{ getGroupCount(recipients) > 1 ? 'получателей': 'получатель' }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in groups"
            :key="i"
            @click.native="setGroup(item.id)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setGroup(0)">
            <span style="color: #24D3ED;">Другая или новая группа </span>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
    <v-spacer />

    <div
      v-if="lastTopic.sender_id == chatUser.id
        && lastTopic.topic_id
        && (!selectedTopicId && !recipients.length)"
      class="btn2"
      @click="setTopic(lastTopic.topic_id)"
    >
      {{ lastTopic.topic_name }}
    </div>

    <!-- сброс настроек -->
    <v-col
      cols="auto"
      align-self="center"
    >
      <v-btn icon>
        <v-icon
          v-if="selectedTopicId || recipients.length"
          color="primary"
          @click="clear()"
        >
          fa-times-circle
        </v-icon>
      </v-btn>
    </v-col>

    <app-topic-bar-topic
      :dialog.sync="dialogTopics"
      :conversation-id="conversationId"
    />

    <group-list
      :dialog.sync="dialogGroups"
      :conversation-id="conversationId"
    />
  </v-row>
</template>

<script>

  //
  import GroupList from './group/List'
  import AppTopicBarTopic from './TopicBarTopic'

  export default {
    components: {
      GroupList,
      AppTopicBarTopic,
    },
    props: {
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    data () {
      return {
        dialogGroups: false,
        dialogTopics: false,
      }
    },
    computed: {
      loadingSend () {
        return this.$store.getters['chat/message/loading']
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      conversation () {
        const conversation = this.$store.getters[
          'chat/conversation/conversations'
        ].filter((item) => item.id === this.conversationId)
        if (conversation.length) return conversation[0]
        return {}
      },
      members () {
        let members = []
        const chatUser = this.$store.getters['chat/chatUser/chatUser']
        if (this.conversation && this.conversation.members) {
          members = this.conversation.members.filter((item) => {
            if (item.id !== chatUser.id && item.active) return item
          })
        }
        return members
      },
      topics () {
        return this.$store.getters['chat/topic/topics']
      },
      lastTopic () {
        let messages = {}
        let topics = this.$store.getters['chat/topic/topics']
        if (!topics.length) {
          return {}
        }
        topics = this.topics
        messages = this.$store.getters['chat/message/messages'][
          this.conversationId
        ]
        let key = null
        for (const item in messages) {
          if (key < item) key = item
        }
        if (key) {
          while (true) {
            let message = null
            message = messages[key]
            if (
              message &&
              message.sender_id === this.chatUser.id &&
              topics.filter((item) => item.id === message.topic_id).length > 0
            ) {
              return {
                sender_id: message.sender_id,
                topic_id: message.topic_id,
                topic_name: message.topic_name,
              }
            }
            key--
            if (!key) break
          }
        }
        return {}
      },
      selectedTopicId: {
        get () {
          return this.$store.getters['chat/topic/selectedTopicId']
        },
        set (val) {
          this.$store.commit('chat/topic/selectedTopicId', val)
        },
      },
      groups () {
        return this.$store.getters['chat/group/groups']
      },
      recipients: {
        get () {
          /// /console.log('recipients')
          /// /console.log(this.$store.getters['chat/message/recipients'])
          return this.$store.getters['chat/message/recipients']
        },
        set (val) {
          this.$store.commit('chat/message/recipients', val)
        },
      },
    },
    methods: {
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      },
      clear () {
        this.selectedTopicId = null
        this.recipients = []
      },
      openDialogTopics () {
        this.dialogTopics = true
      },
      openDialogGroups () {
        this.dialogGroups = true
      },
      setTopic (id) {
        if (id === 0) this.openDialogTopics()
        else this.selectedTopicId = id
      },
      getTopicName () {
        const topic = this.topics.filter(
          (item) => item.id === this.selectedTopicId,
        )
        if (topic.length) {
          return topic[0].name
        }
        return ''
      },
      setGroup (id) {
        if (id === 0) this.openDialogGroups()
        else {
          const group = this.groups.filter((item) => item.id === id)
          if (group.length) {
            this.recipients = group[0].members.map((item) => item.id)
          }
        }
      },
      getGroupName () {
        const group = this.groups.filter(
          (item) => item.id === this.selectedGroupId,
        )
        if (group.length) {
          return group[0].name
        }
        return ''
      },
      getGroupCount (recipients) {
        return Array.from(new Set(recipients)).length
      },
    },
  }
</script>

<style scoped>

.row-send-bar {
  width: 100%;
  /* height: 46px; */
  /* padding: 8px 13px 0 13px; */
  background-color: #dddfe0;
  /* z-index: 2; */
}

.btn {
  padding: 3px 6px;
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;
  margin-right: 8px;
  font-size: 12px;
}

.btn2 {
  padding: 3px 6px;
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;
  font-size: 12px;
}

.recipients-badge {
  padding: 3px 6px;
  border-radius: 4px;
  background-color: #24d3ed;
  cursor: pointer;
  margin-right: 8px;
  font-size: 12px;
  color: #ffffff;
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
