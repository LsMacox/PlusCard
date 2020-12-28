<template>
  <div class="app--component--topic">
    <div class="topic-box">
      <div class="topic-actions">
        <iconify-icon
          class="icon icon-close"
          icon="ion-close-circle-outline"
          width="21"
          @click="close"
        />
        <iconify-icon
          class="icon icon-plus"
          icon="add-circle-outline"
          width="21"
          @click="openTopicPanel"
        />
      </div>
      <ul
        ref="topicList"
        class="topic-list"
      >
        <template v-if="topics.length">
          <v-slide-group
            center-active
            show-arrows
            @change="choiceTopic"
          >
            <v-slide-item
              v-for="topic in topics"
              :key="topic.id"
              v-slot="{ toggle }"
            >
              <v-btn
                class="item-btn"
                :input-value="selectedTopic ? selectedTopic.id === topic.id : false"
                exact-active-class="primary-100 primary--text"
                active-class="primary neutral-100--text"
                depressed
                outlined
                @click="toggle"
              >
                <p class="body-s-semibold">
                  {{ topic.name }}
                </p>
              </v-btn>
            </v-slide-item>
            <template v-slot:prev>
              <iconify-icon
                :class="['icon', 'icon-prev']"
                icon="feather-chevron-left"
                width="15"
              />
            </template>
            <template v-slot:next>
              <iconify-icon
                :class="['icon', 'icon-next']"
                icon="feather-chevron-right"
                width="15"
              />
            </template>
          </v-slide-group>
        </template>
        <template v-else>
          <v-btn
            class="item-btn"
            outlined
          >
            <p class="body-s-semibold">
              Темы не найдены!
            </p>
          </v-btn>
        </template>
      </ul>
    </div>
    <div class="topic-choices">
      <ul class="choice__list">
        <li class="choice__item">
          <p class="body-xs-semibold">
            {{ selectedTopic ? '#' + selectedTopic.name : '' }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  // Mixins
  import MixinIndex from '@/views/communications/mixins/index.js'
  import MixinCalculation from '@/mixins/calculation'

  export default {
    mixins: [
      MixinIndex,
      MixinCalculation,
    ],
    props: {
      conversationId: {
        type: [Number, String],
        default: '',
      },
      isTopicPanel: Boolean,
    },
    data () {
      return {
      }
    },
    computed: {
      topics () {
        return this.$store.getters['chat/topic/topics']
      },
      selectedTopic () {
        if (this.selectedTopicId) {
          return this.topics.find(t => t.id === this.selectedTopicId) || undefined
        }
        return undefined
      },
      isTopic () {
        return this.$store.getters['chat/sendbox/isTopic']
      },
      selectedTopicId () {
        return this.$store.getters['chat/sendbox/topicId']
      },
    },
    watch: {
    },
    async created () {
      await this.$store.dispatch('chat/topic/list', this.conversationId)
    },
    mounted () {},
    methods: {
      choiceTopic (idx) {
        if (typeof idx === 'undefined') {
          this.$store.commit('chat/sendbox/topicId', NaN)
          return
        }
        this.$store.commit('chat/sendbox/topicId', this.topics[idx].id)
      },
      openTopicPanel () {
        this.$emit('update:isTopicPanel', true)
      },
      close () {
        this.$store.commit('chat/sendbox/isTopic', false)
      },
    },
  }
</script>
