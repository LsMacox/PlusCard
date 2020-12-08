<template>
  <div>
    <div class="pls--pushcon-tape-block-header">
      <div style="cursor: pointer;">
        <v-icon>
          $iconify_bi-arrow-down-up
        </v-icon>
      </div>
      <div style="cursor: pointer;">
        {{ getBlockTitle(block.type) }}
      </div>
      <v-spacer />
      <div>
        <v-icon
          @click="remove()"
        >
          $iconify_feather-trash
        </v-icon>
      </div>
    </div>
    <block-text
      v-if="block.type === 'TEXT'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-image
      v-if="block.type === 'IMAGE'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-images
      v-if="block.type === 'IMAGES'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-video
      v-if="block.type === 'VIDEO'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-videos
      v-if="block.type === 'VIDEOS'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-friend
      v-if="block.type === 'FRIEND'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-friends
      v-if="block.type === 'FRIENDS'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-button
      v-if="block.type === 'BUTTON'"
      :block="block"
      @update:block="updateBlock"
    />
  </div>
</template>

<script>
  import BlockMixin from './blockMixin'
  import BlockText from './BlockText'
  import BlockImage from './BlockImage'
  import BlockImages from './BlockImages'
  import BlockVideo from './BlockVideo'
  import BlockVideos from './BlockVideos'
  import BlockFriend from './BlockFriend'
  import BlockFriends from './BlockFriends'
  import BlockButton from './BlockButton'

  export default {
    components: {
      BlockText,
      BlockImage,
      BlockImages,
      BlockVideo,
      BlockVideos,
      BlockFriend,
      BlockFriends,
      BlockButton,
    },
    mixins: [BlockMixin],
    props: {
      block: {
        type: Object,
        default: () => ({}),
      },
    },
    data () {
      return {}
    },
    methods: {
      getBlockTitle (type) {
        const button = this.buttons.find(item => item.type === type)
        return button.title
      },
      remove () {
        this.$emit('remove')
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
</style>
