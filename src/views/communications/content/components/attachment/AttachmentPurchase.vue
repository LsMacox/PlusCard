<template>
  <div class="attachment-purchase">
    <div class="purchase">
      <div class="purchase-author">
        {{ getAuthor() }} создал(а):
      </div>
      <div class="purchase-name">
        {{ content.name }}
      </div>

      <div class="list">
        <div
          v-for="(item, i) in content.products"
          :key="i"
          class="product-row"
        >
          <div
            v-if="item.performed_at"
            class="product-check"
          >
            <v-img :src="'../img/' + iconCheck" />
          </div>
          <div
            v-else
            class="product-check"
          >
            <v-img :src="'../img/' + iconUnCheck" />
          </div>
          <div>{{ item.name }}</div>
        </div>
      </div>

      <div
        v-if="checkJoin()"
        class="button"
        @click="join()"
      >
        <v-icon color="#07C9EB">
          add
        </v-icon>
        <div class="button-text">
          Присоединиться
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      content: {
        required: true,
        type: Object,
      },
    },
    data () {
      return {
        iconCheck: 'purchase-check.png',
        iconUnCheck: 'purchase-uncheck.png',
      }
    },
    computed: {
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
    },
    mounted () {
      /// /console.log(this.content)
    },
    methods: {
      getAuthor () {
        let author = ''
        if (this.content) {
          const creatorId = this.content.creator_id
          this.content.members.forEach(item => {
            if (item.id === creatorId) {
              author = item.name
            }
          })
        }
        return author
      },
      checkJoin () {
        let check = false
        if (this.content) {
          const chatUserId = this.chatUser.id
          this.content.members.forEach(item => {
            if (item.id === chatUserId && item.status === 'invited') {
              check = true
            }
          })
        }
        return check
      },
      async join () {

      },
    },
  }
</script>
