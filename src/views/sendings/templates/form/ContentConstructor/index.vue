<template>
  <div class="pls--pushcon">
    <!-- добавление блоков -->
    <div class="pls--pushcon-menu">
      <div class="pls--pushcon-menu-items">
        <v-tooltip
          v-for="(item, i) in buttons"
          :key="i"
          open-delay="1000"
          right
        >
          <template v-slot:activator="{ on, attrs }">
            <div
              class="pls--pushcon-menu-item"
              v-bind="attrs"
              v-on="on"
              @click="add(item.type, item.disable)"
            >
              <v-icon
                class="pls--pushcon-menu-item-icon"
              >
                $iconify_{{ item.icon }}
              </v-icon>
            </div>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
      </div>
    </div>
    <!-- лента блоков -->
    <div class="pls--pushcon-tape">
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
            :block.sync="item"
            @update:block="updateLocalAttachments(i, $event)"
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
  import BlockMixin from './block'

  export default {
    components: {
      draggable,
      Block,
    },
    mixins: [BlockMixin],
    props: {
      attachments: {
        type: Array,
        default: () => ([]),
      },
    },
    data () {
      return {
        localAttachments: [],
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
    watch: {
      attachments: {
        handler (v) {
          console.log('watch !!!!')
          console.log(v)
          this.localAttachments = Object.copy(v)
          this.localAttachments = Object.assign([], this.localAttachments)
        },
        deep: true,
      },
    },
    created () {
      console.log('this.attachments.length')
      console.log(this.attachments.length)
      if (this.attachments && this.attachments.length) {
        this.localAttachments = Object.copy(this.attachments)
      } else {
        this.localAttachments.push(Object.copy(this.blockText))
      }
    },
    methods: {
      add (type, disable) {
        if (!disable) {
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
        }
      },
      remove (i) {
        this.localAttachments.splice(i, 1)
        this.updateAttachments(this.localAttachments)
      },
      updateLocalAttachments (i, v) {
        this.localAttachments[i] = v
        this.localAttachments = Object.assign([], this.localAttachments)
        this.updateAttachments(this.localAttachments)
      },
      updateAttachments (v) {
        this.$emit('update:attachments', Object.copy(v))
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
</style>
