<template>
  <div style="display: flex;">
    <div>
      <v-icon
        x-large
        @click="play()"
      >
        play_circle_outline
      </v-icon>
    </div>

    <div>
      <v-img
        :src="getOsc()"
        class="image-thumb"
      />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      content: {
        type: Object,
        required: true,
      },
      sender: {
        type: Number,
        required: true,
      },
    },
    data () {
      return {

      }
    },
    computed: {
      chatUser () {
        return this.$store.getters['chat/chatUser/chatUser']
      },
    },
    methods: {
      getOsc () {
        if (this.sender === this.chatUser.id) return this.content.osc_light
        return this.content.osc_dark
      },
      play () {
        const audio = new Audio(this.content.url)
        audio.play()
      },
    },
  }
</script>

<style scoped>
    .image-thumb {
        width: 168px;
        height: 42px;
        border-radius: 10px;
    }
</style>
