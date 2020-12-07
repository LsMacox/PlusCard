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
        >
          <div
            v-if="!item.deleted"
            class="pls--pushcon-tape-block"
          >
            <block
              :block.sync="item"
              @update:block="updateLocalAttachments(i, $event)"
              @remove="remove(i)"
            />
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import Block from './Block.vue'
  import BlockMixin from './blockMixin'

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
          id: null,
          type: 'TEXT',
          value: {
            text: null,
          },
        }
      },
      blockImage () {
        return {
          id: null,
          type: 'IMAGE',
          value: {
            url: null,
          },
        }
      },
      blockImages () {
        return {
          id: null,
          type: 'IMAGES',
          value: [
            {
              url: null,
            },
          ],
        }
      },
      blockVideo () {
        return {
          id: null,
          type: 'VIDEO',
          value: {
            url: null,
          },
        }
      },
      blockVideos () {
        return {
          id: null,
          type: 'VIDEOS',
          value: [
            {
              url: null,
            },
          ],
        }
      },
      blockFriend () {
        return {
          id: null,
          type: 'FRIEND',
          value: {
            url: null,
          },
        }
      },
      blockFriends () {
        return {
          id: null,
          type: 'FRIENDS',
          value: [
            {
              url: null,
            },
          ],
        }
      },
      blockButton () {
        return {
          id: null,
          type: 'BUTTON',
          value: {
            text: 'Перейти',
            color: 'blue',
            broadcaster_id: null,
            action: null,
          },
        }
      },
    },
    watch: {
      attachments: {
        handler (v) {
          this.localAttachments = Object.copy(v)
          this.localAttachments = Object.assign([], this.localAttachments)
        },
        deep: true,
      },
    },
    created () {
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
            case 'TEXT':
              this.localAttachments.push(Object.copy(this.blockText))
              break
            case 'IMAGE':
              this.localAttachments.push(Object.copy(this.blockImage))
              break
            case 'IMAGES':
              this.localAttachments.push(Object.copy(this.blockImages))
              break
            case 'VIDEO':
              this.localAttachments.push(Object.copy(this.blockVideo))
              break
            case 'VIDEOS':
              this.localAttachments.push(Object.copy(this.blockVideos))
              break
            case 'FRIEND':
              this.localAttachments.push(Object.copy(this.blockFriend))
              break
            case 'FRIENDS':
              this.localAttachments.push(Object.copy(this.blockFriends))
              break
            case 'BUTTON':
              this.localAttachments.push(Object.copy(this.blockButton))
              break
          }
        }
      },
      remove (i) {
        // вложение уже загружено в базу
        if (this.localAttachments[i].id) {
          this.localAttachments[i].deleted = true // метка удаления вложения

          // вложения нет в базе
        } else {
          this.localAttachments.splice(i, 1)
        }
        this.updateAttachments(this.localAttachments)
      },
      updateLocalAttachments (i, v) {
        this.localAttachments[i] = v
        this.localAttachments = Object.assign([], this.localAttachments)
        this.updateAttachments(this.localAttachments)
      },
      updateAttachments (v) {
        this.$emit('update:attachments', v)
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
</style>
