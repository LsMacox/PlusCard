<template>
  <div class="attachment-video">
    <div
      :style="'background: url(' + content.thumb + ');'"
      class="video-thumb"
      @click="show = true"
    >
      <!--        <div-->
      <!--                style="background: url(img/videoplay.png);"-->
      <!--                class="video-thumb-mask"-->
      <!--        ></div>-->
      <i
        class="fa fa-play-circle"
        aria-hidden="true"
        style="font-size: 48px; margin-top: 35px; color: #E0E0E0;"
      />
    </div>

    <v-dialog

      v-if="show"
      v-model="show"

      max-width="80%"
      content-class="preview-dialog"
    >
      <v-card class="preview-dialog__card">
        <v-container class="preview-dialog__container">
          <v-row justify="end">
            <v-btn
              icon
              :href="content.url"
              color="white"
              target="_blank"
              download
            >
              <v-icon>fa-download</v-icon>
            </v-btn>
            <v-btn
              icon
              color="white"
              @click="show = false"
            >
              <v-icon>fa-times</v-icon>
            </v-btn>
          </v-row>
          <v-row
            class="image-row"
            justify="center"
            align="center"
          >
            <v-col cols="auto">
              <video-player
                ref="videoPlayer"
                class="video-player"
                :options="playerOptions"
                :playsinline="true"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
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
