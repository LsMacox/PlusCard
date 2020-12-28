<template>
  <div class="group-topic">
    <div class="group-topic__header">
      <p class="title-m-bold neutral-900--text">
        <template v-if="!isComponentNewTopic && !isComponentEditTopic">
          Темы чата «{{ conversationName }}»
        </template>
        <template v-if="isComponentNewTopic">
          Новая тема
        </template>
        <template v-if="isComponentEditTopic">
          Редактирование темы
        </template>
      </p>
      <base-text-field
        v-if="!isComponentNewTopic && !isComponentEditTopic"
        v-model="searchTopic"
        class="field-search"
        placeholder="Поиск тем"
        prepend-inner-icon="$iconify_ion-search-outline"
        clear-icon="$iconify_ion-close-circle-outline"
        :prepend-inner-icon-color="this.$vuetify.theme.themes.light['neutral-500']"
        clearable
        hide-details
      />
    </div>
    <div
      v-if="!isComponentNewTopic && !isComponentEditTopic"
      class="group-topic__content"
    >
      <ul
        v-if="topics.length"
        class="topics__list"
      >
        <li
          v-for="topic in topicsFiltered"
          :key="topic.id"
          class="topic__item"
        >
          <div class="left-block">
            <p class="topic-name body-l-semibold neutral-900--text">
              {{ topic.name }}
            </p>
            <p class="members-names body-s-medium neutral-500--text">
              {{ getTopicMembersName(topic.id) }}
            </p>
          </div>
          <div class="right-block">
            <v-btn
              class="btn-edit primary-100"
              @click="editTopic(topic.id)"
            >
              <iconify-icon
                class="icon-edit primary--text"
                icon="feather-edit-2"
                width="15"
              />
            </v-btn>
          </div>
        </li>
      </ul>
      <div class="topic__create">
        <v-btn
          class="create__btn"
          color="primary"
          @click="isComponentNewTopic = true"
        >
          <iconify-icon
            icon="feather-plus-circle"
            class="icon-plus"
            width="21"
          />
          <p class="body-m-semibold neutral-100--text">
            Новая тема
          </p>
        </v-btn>
      </div>
    </div>
    <div
      v-else
      class="group-topic__content"
    >
      <div class="topic__fields">
        <div class="topic-field">
          <p class="topic-name body-l-semibold neutral-900--text">
            Название темы
          </p>
          <p class="topic-description body-m-regular-neutral-700--text">
            Придумывайте осмысленные навазния для тем, чтобы участники чата понимали о чем идет речь.
          </p>
          <base-text-field
            v-model="topicName"
            class="topic-field"
            placeholder="Введите название темы"
            hide-details
          />
        </div>
        <div class="topic-field">
          <p class="body-l-semibold neutral-900--text">
            Участники
          </p>
          <p class="body-m-regular-neutral-700--text">
            Все участники чата видят сообщения с этой темой. Вы можете включать и выключать возможность писать сообщения с этой темой отдельным участникам.
          </p>
          <ul
            ref="memberList"
            class="members__list"
          >
            <li
              v-for="member in activeMembers"
              :key="member.id"
              class="member__item"
            >
              <div class="left-block">
                <div class="avatar">
                  <img
                    :src="member.avatar"
                    @error="e => e.target.src = img404"
                  >
                </div>
                <p class="name body-m-medium neutral-900--text">
                  {{ member.name }}
                </p>
              </div>
              <div class="right-block">
                <base-ext-switch
                  v-model="membersCanWrite[member.id]"
                  class="status"
                  :label="membersCanWrite[member.id] ? 'Пишит' : 'Читает'"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div
      v-if="isComponentNewTopic || isComponentEditTopic"
      class="group-topic__footer"
    >
      <div class="topic__controls">
        <v-btn
          v-if="isComponentNewTopic"
          class="create__btn"
          color="primary"
          :loading="isRequestCreate"
          @click="createTopic"
        >
          <iconify-icon
            icon="ion-checkmark-circle-outline"
            class="icon icon-check"
            width="21"
          />
          <p class="body-m-semibold neutral-100--text">
            Создать тему
          </p>
        </v-btn>
        <v-btn
          v-if="isComponentEditTopic"
          class="save__btn"
          color="primary"
          :loading="isRequestUpdate"
          @click="updateTopic"
        >
          <iconify-icon
            icon="ion-checkmark-circle-outline"
            class="icon icon-check"
            width="21"
          />
          <p class="body-m-semibold neutral-100--text">
            Сохранить
          </p>
        </v-btn>
        <v-btn
          v-if="isComponentEditTopic"
          class="delete__btn error--text"
          color="primary"
          :loading="isRequestDelete"
          text
          @click="deleteTopic"
        >
          <iconify-icon
            icon="feather-trash"
            class="icon icon-check"
            width="21"
          />
          <p class="body-m-semibold">
            Удалить тему
          </p>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  // mixins
  import MixinIndex from '@/views/communications/mixins/index.js'
  // other
  import FuzzySearch from 'fuzzy-search'

  export default {
    mixins: [
      MixinIndex,
    ],
    props: {
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    data () {
      return {
        searchTopic: '',
        topicName: '',
        membersCanWrite: {},
        isRequestCreate: false,
        isRequestUpdate: false,
        isRequestDelete: false,
        editTopicId: NaN,
        isComponentNewTopic: false,
        isComponentEditTopic: false,
      }
    },
    computed: {
      conversation () {
        return this.$store.getters['chat/data/conversation'](this.conversationId)
      },
      conversationName () {
        return this.conversation.display_name && this.conversation.display_name.length
          ? this.conversation.display_name
          : 'Без названия'
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      members () {
        return this.$store.getters['chat/data/members'](this.conversationId)
      },
      activeMembers () {
        return this.members.filter(m => m.active && m.id !== this.chatUser.id)
      },
      topicsSearcher () {
        return new FuzzySearch(
          this.topics,
          ['name'],
          {
            caseSensitive: false,
          },
        )
      },
      topicsFiltered () {
        let topicsFiltered = this.topics
        const search = String(this.searchTopic).replace(/\s+/g, ' ').replace(/^\s/g, '')

        if (this.searchTopic && search.length) {
          topicsFiltered = this.topicsSearcher.search(search.toLowerCase())
        }

        return topicsFiltered
      },
      topics () {
        this.setMembersCanWrite({})
        const topics = this.$store.getters['chat/topic/topics']
        if (topics.members && topics.members.length) {
          topics.members.forEach(m => {
            this.membersCanWrite[m.id] = m.can_write
          })
        }
        return topics
      },
    },
    watch: {
      editTopicId (v) {
        if (this.isComponentEditTopic) {
          const topic = this.topics.find(t => t.id === v)
          this.topicName = topic.name
          if (topic.members.length) {
            topic.members.forEach(m => {
              if (m.can_write) {
                this.membersCanWrite[m.id] = m.can_write
              }
            })
          }
        }
      },
      isComponentNewTopic (v) {
        if (v) {
          this.isComponentEditTopic = false
        }
      },
      isComponentEditTopic (v) {
        if (v) {
          this.isComponentNewTopic = false
        }
      },
    },
    mounted () {
      this.isComponentNewTopic = false
      this.isComponentEditTopic = false

      this.$nextTick(() => {
        window.addEventListener('resize', this.listMaxHeight)
      })
    },
    updated () {
      this.listMaxHeight()
    },
    methods: {
      listMaxHeight () {
        if (this.$refs?.memberList) {
          this.$refs.memberList.style.maxHeight = document.body.clientHeight - 554 + 'px'
        }
      },
      setMembersCanWrite (payload) {
        this.membersCanWrite = payload
      },
      getTopicMembersName (topicId) {
        const members = this.topics.find(t => t.id === topicId).members
        const canWriteMembers = members.filter(m => {
          return (m.id !== this.chatUser.id && m.can_write)
        })
        const names = []

        if (canWriteMembers.length) {
          if (canWriteMembers.length === (members.length - 1)) {
            return 'Все участники чата'
          }

          this.activeMembers.forEach(am => {
            canWriteMembers.forEach(m => {
              if (am.id === m.id) names.push(am.name)
            })
          })
        } else {
          return 'Нету участников'
        }

        return names.join(', ')
      },
      createTopic () {
        const topic = {
          conversation_id: this.conversationId,
          name: this.topicName,
          is_private: false,
          members: this._prepareRequestMembers(),
        }

        this.isRequestCreate = true
        this.$store.dispatch('chat/topic/create', topic).then(() => {
          this.isComponentNewTopic = false
          this.membersCanWrite = {}
        }).finally(() => {
          this.isRequestCreate = false
        })
      },
      updateTopic () {
        const topic = {
          id: this.editTopicId,
          name: this.topicName,
          is_private: false,
          members: this._prepareRequestMembers(),
        }

        this.isRequestUpdate = true
        this.$store.dispatch('chat/topic/update', topic).then(() => {
          this.isComponentEditTopic = false
          this.membersCanWrite = {}
        }).finally(() => {
          this.isRequestUpdate = false
        })
      },
      deleteTopic () {
        this.isRequestDelete = true
        this.$store.dispatch('chat/topic/delete', this.editTopicId).then(() => {
          this.isComponentEditTopic = false
          this.membersCanWrite = {}
        }).finally(() => {
          this.isRequestDelete = false
        })
      },
      editTopic (topicId) {
        console.log('editTopic', topicId)
        this.isComponentEditTopic = true
        this.editTopicId = topicId
      },
      _prepareRequestMembers () {
        const members = []

        this.activeMembers.forEach(am => {
          members.push({ id: am.id, can_write: false })
        })

        if (Object.keys(this.membersCanWrite).length) {
          for (const id in this.membersCanWrite) {
            const currMemberIdx = members.findIndex(m => Number(m.id) === Number(id))
            if (currMemberIdx !== -1) {
              members[currMemberIdx].can_write = this.membersCanWrite[id]
            }
          }
        }

        return members
      },
    },
  }
</script>
