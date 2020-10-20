<template>
  <v-row
    v-if="false"
    no-gutters
  >
    <div>
      <v-icon
        x-large
        @click="startPlay()"
      >
        fa-play-circle
      </v-icon>
    </div>

    <div>
      <v-img
        :src="getOsc()"
        class="image-thumb"
      />
    </div>
  </v-row>
  <v-row v-else>
    <v-col>
      <audio controls>

        <source
          :src="content.url"
          type="audio/mpeg"
          :preload="preload"
          autoplay="false"
        >

      </audio>
    </v-col>
  </v-row>
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
        play: false,
        preload: 'metadata', // auto (полностью), metadata (небольшую часть, чтобы определить основные метаданные) и none (без загрузки)
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
      startPlay () {
        this.play = true
        // const audio = new Audio(this.content.url)
        // audio.play()
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
