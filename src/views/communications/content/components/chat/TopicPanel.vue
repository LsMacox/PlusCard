<template>
  <base-side-panel
    v-model="innerActiveSidePanel"
    class="side-panel__topics"
    :width="483"
  >
    <group-topic
      v-if="isGroup"
      :conversation-id="conversationId"
    />
    <user-topic
      v-else
      :conversation-id="conversationId"
    />
  </base-side-panel>
</template>

<script>
  // components
  import UserTopic from './topics/UserTopic'
  import GroupTopic from './topics/GroupTopic'

  // mixins
  import MixinIndex from '@/views/communications/mixins/index'

  export default {
    components: {
      UserTopic,
      GroupTopic,
    },
    mixins: [MixinIndex],
    model: {
      prop: 'activeSidePanel',
      event: 'changeSidePanel',
    },
    props: {
      activeSidePanel: Boolean,
      conversationId: {
        type: [Number, String, null],
        default: null,
      },
    },
    data () {
      return {
        innerActiveSidePanel: this.activeSidePanel,
      }
    },
    computed: {
      isGroup () {
        return this.members.length > 2
      },
      members () {
        return this.$store.getters['chat/data/members'](this.conversationId).filter(m => m.active)
      },
    },
    watch: {
      innerActiveSidePanel (v) {
        this.$emit('changeSidePanel', v)
      },
      activeSidePanel (v) {
        this.innerActiveSidePanel = v
      },
    },
    methods: {

    },
  }
</script>
