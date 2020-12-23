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
          <li
            v-for="(topic, idx) in topics"
            :key="idx + '-' + topic.id"
            :ref="'topicItem-' + idx"
            class="topic-item"
            :class="selectedTopic && selectedTopic.id === topic.id ? 'active' : ''"
            @click="choiceTopic(topic)"
          >
            <p class="body-s-semibold">
              {{ topic.name }}
            </p>
          </li>
        </template>
        <template v-else>
          <li
            class="topic-item"
          >
            <p class="body-s-semibold">
              Темы не найдены!
            </p>
          </li>
        </template>
      </ul>
      <div class="topic-controls">
        <iconify-icon
          :class="['icon', 'icon-prev', isPrev ? 'active' : '']"
          icon="feather-chevron-left"
          width="21"
          @click="prev"
        />
        <iconify-icon
          :class="['icon', 'icon-next', isNext ? 'active' : '']"
          icon="feather-chevron-right"
          width="21"
          @click="next"
        />
      </div>
    </div>
    <div class="topic-choices">
      <ul class="choice__list">
        <li class="choice__item">
          <p class="body-xs-semibold">
            {{ Object.keys(selectedTopic).length > 0 ? '#' + selectedTopic.name : '' }}
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
      selectedTopic: {
        type: Object,
        default: () => {
          return {}
        },
      },
      isTopicPanel: Boolean,
      isTopicMessage: Boolean,
    },
    data () {
      return {
        listStep: 0,
        hideCount: 0,
      }
    },
    computed: {
      testTopics () {
        const testArr = []
        const topics = this.$store.getters['chat/topic/topics']
        if (topics.length) {
          for (let i = 0; i < 15; i++) {
            const topic = Object.assign({}, topics[0])
            topic.id = Math.round(Math.random() * 7000 + i)
            testArr.push(topic)
          }
        }
        return testArr
      },
      topics () {
        return this.$store.getters['chat/topic/topics']
      },
      isPrev: {
        cache: false,
        get () {
          if (this.listStep <= 0) return false
          return true
        },
      },
      isNext: {
        cache: false,
        get () {
          if (this.listStep >= this.hideCount) return false
          return true
        },
      },
    },
    watch: {
      topics: {
        deep: true,
        handler () {
          this.hideAppearItem()
        },
      },
    },
    async created () {
      await this.$store.dispatch('chat/topic/list', this.conversationId)
    },
    mounted () {
      this.listStep = 0
      this.hideAppearItem()
    },
    methods: {
      hideAppearItem () {
        if (this.$refs?.topicList) {
          this.hideCount = 0
          const listWidth = this.$refs.topicList.clientWidth
          console.log('listWidth', listWidth)
          for (let i = 0; i < this.topics.length; i++) {
            const item = this.$refs['topicItem-' + String(this.topics.length - 1 - i)][0]
            const itemOffsetLeft = this.getFromHideNodeAttribute(item, 'offsetLeft')
            console.log('itemOffsetLeft', itemOffsetLeft)
            if (itemOffsetLeft > listWidth) {
              this.hideCount++
              item.classList.add('hide')
            }
          }
          console.log('hideCount', this.hideCount)
        }
      },
      prev () {
        if (this.listStep <= 0) return
        this.listStep--
        this.$refs['topicItem-' + this.listStep][0].classList.remove('hide')
        const tailItem = this.$refs?.['topicItem-' + String(this.topics.length - 1 - this.listStep)]
        tailItem[0].classList.add('hide')
      },
      next () {
        if (this.listStep >= this.hideCount) return
        this.listStep++
        for (let i = 0; i < this.listStep; i++) {
          this.$refs['topicItem-' + i][0].classList.add('hide')
          const tailItem = this.$refs?.['topicItem-' + String(this.topics.length - 1 - i)]
          tailItem[0].classList.remove('hide')
        }
      },
      choiceTopic (topic) {
        this.$emit('update:selectedTopic', Object.assign({}, topic))
      },
      openTopicPanel () {
        this.$emit('update:isTopicPanel', true)
      },
      close () {
        this.$emit('update:isTopicMessage', false)
      },
    },
  }
</script>
