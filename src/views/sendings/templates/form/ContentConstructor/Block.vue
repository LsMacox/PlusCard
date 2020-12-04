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
      v-if="block.type === 'text'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-image
      v-if="block.type === 'image'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-images
      v-if="block.type === 'images'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-video
      v-if="block.type === 'video'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-videos
      v-if="block.type === 'videos'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-friend
      v-if="block.type === 'friend'"
      :block="block"
      @update:block="updateBlock"
    />
    <block-friends
      v-if="block.type === 'friends'"
      :block="block"
      @update:block="updateBlock"
    />
  </div>
</template>

<script>
  import BlockMixin from './block'
  import BlockText from './BlockText'
  import BlockImage from './BlockImage'
  import BlockImages from './BlockImages'
  import BlockVideo from './BlockVideo'
  import BlockVideos from './BlockVideos'
  import BlockFriend from './BlockFriend'
  import BlockFriends from './BlockFriends'

  export default {
    components: {
      BlockText,
      BlockImage,
      BlockImages,
      BlockVideo,
      BlockVideos,
      BlockFriend,
      BlockFriends,
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
