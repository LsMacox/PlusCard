<template>
  <div>
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

<style lang="scss" scoped>

.preview-dialog {
  .preview-dialog__card {
    background-color: rgba(0, 0, 0, 0.8);

    .preview-dialog__container {
      // height: 100%;
      .image-row {
        min-height: 80vh;
      }
    }
  }
}

    .video-thumb {
        position: relative;
        width: 160px;
        height: 120px;
        border-radius: 10px;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: cover !important;
        text-align: center;
        cursor:pointer;
    }

    .video-thumb-mask {
        display: inline-block;
        /*position: absolute;
        top: 50%;*/
        transform: translateY(-50%);
        width: 60px;
        height: 60px;
        margin-top: calc(50% - 20px);
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: cover !important;
    }

    .video-modal {
        position: relative;
        display: flex;
        background-color: #ffffff;
    }

    // .video-player {}

    .download {
        display: block;
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 4px;
        background-color: #181818;
        z-index: 2;
    }

    .download-icon {
        color: #ffffff;
        font-size: 40px;
    }

    .attachment--preview--toolbar {
        position: absolute;
        top: 10px;
        right: 40px;
    & i {
          cursor:pointer;
          color:#fff;
          font-size: 20px;
          width:20px;
          height: 20px;
      }
    }
</style>
