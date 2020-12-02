<template>
  <div class="pls--pushcon">
    <!-- добавление блоков -->
    <div class="pls--pushcon-menu">
      <div class="pls--pushcon-menu-items">
        <div
          v-for="(item, i) in buttons"
          :key="i"
          class="pls--pushcon-menu-item"
          @click="add(item.type)"
        >
          <v-icon
            class="pls--pushcon-menu-item-icon"
          >
            $iconify_{{ item.icon }}
          </v-icon>
        </div>
      </div>
    </div>
    <!-- лента блоков -->
    <div class="pls--pushcon-tape">
      {{ localAttachments }}
      <draggable
        :list="localAttachments"
        class="list-group"
        ghost-class="pls--pushcon-tape-ghost"
        @start="dragging = true"
        @end="dragging = false"
      >
        <div
          v-for="(item, i) in localAttachments"
          :key="i"
          class="pls--pushcon-tape-block"
        >
          <block
            :block="item"
            @update:block="updateAttachments(i, $event)"
            @remove="remove(i)"
          />
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import Block from './Block'

  export default {
    components: {
      draggable,
      Block,
    },
    props: {
      attachments: {
        type: Array,
        default: () => ([]),
      },
    },
    data () {
      return {
        localAttachments: [],
        buttons: [
          { type: 'text', icon: 'feather-edit' },
          { type: 'image', icon: 'feather-edit' },
          { type: 'images', icon: 'feather-edit' },
          { type: 'video', icon: 'feather-edit' },
          { type: 'videos', icon: 'feather-edit' },
          { type: 'friend', icon: 'feather-edit' },
          { type: 'friends', icon: 'feather-edit' },
        ],
        dragging: false,
      }
    },
    computed: {
      blockText () {
        return {
          type: 'text',
          value: null,
        }
      },
      blockImage () {
        return {
          type: 'image',
          value: null,
        }
      },
      blockImages () {
        return {
          type: 'images',
          value: [
            {
              url: null,
            },
          ],
        }
      },
      blockVideo () {
        return {
          type: 'video',
          value: null,
        }
      },
      blockVideos () {
        return {
          type: 'videos',
          value: [
            {
              url: null,
            },
          ],
        }
      },
      blockFriend () {
        return {
          type: 'friend',
          value: null,
        }
      },
      blockFriends () {
        return {
          type: 'friends',
          value: [
            {
              url: null,
            },
          ],
        }
      },
    },
    created () {
      if (this.attachments.length) {
        this.localAttachments = Object.copy(this.attachments)
      } else {
        this.localAttachments.push(Object.copy(this.blockText))
      }
    },
    methods: {
      add (type) {
        switch (type) {
          case 'text':
            this.localAttachments.push(Object.copy(this.blockText))
            break
          case 'image':
            this.localAttachments.push(Object.copy(this.blockImage))
            break
          case 'images':
            this.localAttachments.push(Object.copy(this.blockImages))
            break
          case 'video':
            this.localAttachments.push(Object.copy(this.blockVideo))
            break
          case 'videos':
            this.localAttachments.push(Object.copy(this.blockVideos))
            break
          case 'friend':
            this.localAttachments.push(Object.copy(this.blockFriend))
            break
          case 'friends':
            this.localAttachments.push(Object.copy(this.blockFriends))
            break
        }
      },
      remove (i) {
        this.localAttachments.splice(i, 1)
      },
      updateAttachments (i, v) {
        this.localAttachments[i] = v
        this.localAttachments = Object.assign([], this.localAttachments)
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
</style>
