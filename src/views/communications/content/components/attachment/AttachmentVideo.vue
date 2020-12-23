<template>
  <div class="attachment-video">
    <div
      class="video-thumb"
    >
      <img
        :src="content.thumb"
        alt="img"
      >
      <iconify-icon
        class="icon-play"
        icon="feather-play"
        width="21"
        @click="show = true"
      />
    </div>

    <v-dialog
      v-if="show"
      v-model="show"
      max-width="80%"
      content-class="dialog-attachment-video dialog-attachment-preview"
    >
      <div class="preview-img">
        <video-player
          ref="videoPlayer"
          class="video-player"
          :options="playerOptions"
          :playsinline="true"
        />
      </div>
    </v-dialog>
  </div>
</template>

<script>
  import 'video.js/dist/video-js.css'
  import { videoPlayer } from 'vue-video-player'

  export default {
    components: {
      videoPlayer,
    },
    props: {
      content: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        show: false,
        download: false,
        playerOptions: {
          // videojs options
          height: '500',
          autoplay: false,
          muted: true,
          language: 'ru',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [],
          // poster: ''
        },
      }
    },
    computed: {
      player () {
        return this.$refs.videoPlayer.player
      },
    },
    mounted () {
      this.playerOptions.sources.push({
        type: this.content.mime,
        src: this.content.url,
      })
      /// ///console.log(this.content)
    },
  }
</script>
