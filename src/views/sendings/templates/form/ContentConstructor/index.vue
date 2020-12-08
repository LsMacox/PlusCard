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
              @click="add(item.type, i, item.disable)"
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
        addedBtn: null,
      }
    },
    computed: {
      template () {
        return this.$store.getters['company/notifications/template']
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
      this.localAttachments = Object.copy(this.attachments)
    },
    methods: {
      async add (type, index, disable) {
        if (!disable && this.addedBtn !== index) {
          try {
            this.loading = true
            this.addedBtn = index
            const item = {
              template_id: this.template.id,
              type,
            }
            switch (type) {
              case 'TEXT':
                item.value = { text: '<p>Текст нового сообщения</p>' }
                break

              case 'IMAGE':
              case 'VIDEO':
              case 'FRIEND':
                item.value = {
                  url: null,
                }
                break

              case 'IMAGES':
              case 'VIDEOS':
              case 'FRIENDS':
                item.value = [
                  {
                    url: null,
                  },
                ]
                break
            }
            await this.$store.dispatch('company/notifications/createAttachment', item)
          } finally {
            this.loading = false
            this.addedBtn = null
          }
        }
      },
      async remove (i) {
        try {
          this.loading = true
          const item = {
            id: this.localAttachments[i].id,
          }
          await this.$store.dispatch('company/notifications/deleteAttachment', item)
        } finally {
          this.loading = false
        }
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
