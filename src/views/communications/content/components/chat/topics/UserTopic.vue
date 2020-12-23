<template>
  <div class="user-topic">
    <div class="user-topic__header">
      <p class="title-m-bold neutral-900--text">
        Темы чата
      </p>
    </div>
    <div class="user-topic__content">
      <ul
        v-if="topics.length"
        class="topics__list"
      >
        <li
          v-for="topic in topics"
          :key="topic.id"
          class="topic__item"
        >
          <div class="d-flex align-center">
            <p class="body-s-semibold primary--text">
              {{ topic.name }}
            </p>
            <v-btn
              text
              :ripple="false"
              :loading="isRequestDeleteLoading"
              class="close d-flex"
              @click="deleteTopic(topic.id)"
            >
              <iconify-icon
                icon="ion-close"
                class="icon-close"
                width="14"
              />
            </v-btn>
          </div>
        </li>
      </ul>
    </div>
    <div class="topic__create">
      <base-text-field
        v-model="createTopicName"
        class="create__field"
        placeholder="Введите название темы"
        error-style="custom"
        validation-placement="left"
        :rules="createTopicNameRules"
        @keypress.enter.exact.stop="createTopic"
      />
      <v-btn
        v-if="createTopicName.replace(/\s+/, ' ').replace(/^\s/, '').length"
        class="create__btn"
        color="primary"
        :loading="isRequestCreateLoading"
        @click="createTopic"
      >
        <iconify-icon
          icon="ion-checkmark-circle-outline"
          class="icon-check"
          width="21"
        />
        <p class="body-m-semibold neutral-100--text">
          Добавить тему
        </p>
      </v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    data () {
      return {
        createTopicName: '',
        createTopicNameRules: [
          v => !!v || 'Введите название темы',
          v => !this.nameExist || 'Тема с таким названием уже существует',
        ],
        isRequestDeleteLoading: false,
        isRequestCreateLoading: false,
      }
    },
    computed: {
      topics () {
        return this.$store.getters['chat/topic/topics']
      },
      profile () {
        return this.$store.getters.user
      },
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
      members () {
        return this.$store.getters['chat/data/members'](this.conversationId)
      },
      nameExist () {
        return this.$store.getters['chat/topic/nameExist']
      },
    },
    methods: {
      async deleteTopic (topicId) {
        this.isRequestDeleteLoading = true
        await this.$store.dispatch('chat/topic/delete', topicId)
          .finally(() => {
            this.isRequestDeleteLoading = false
          })
      },
      async createTopic () {
        console.log(this.members)

        const members = []

        this.members.forEach(m => {
          members.push({
            id: m.id,
            can_write: true,
          })
        })

        const topic = {
          conversation_id: this.conversationId,
          name: this.createTopicName,
          is_private: true,
          members: members,
        }

        this.isRequestCreateLoading = true
        await this.$store.dispatch('chat/topic/create', topic)
          .finally(() => {
            this.isRequestCreateLoading = false
          })
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
