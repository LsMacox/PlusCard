<template>
  <div
    class="app-conversation--sendForm__message__record-stop"
  >
    <div class="right-block">
      <iconify-icon
        v-if="!isPlay"
        class="icon icon-play"
        icon="feather-play"
        width="21"
        @click="switchPlayBackRecording"
      />
      <iconify-icon
        v-else
        class="icon icon-play"
        icon="ion-pause-outline"
        width="21"
        @click="switchPlayBackRecording"
      />
      <div class="strips">
        <div
          v-for="(v, i) in recordVolumes"
          :key="i"
          class="strip"
          :class="[isRecordStripActive(i) ? 'active' : '']"
          :style="`height: ${v}px`"
        />
      </div>
      <div class="durations">
        <p class="body-m-regular neutral-600--text">
          {{ this.$moment(recordPlayCurrentTime * 1000).format('mm:ss') }}/{{ recordList[0].duration }}
        </p>
      </div>
    </div>
    <div class="left-block">
      <iconify-icon
        class="icon icon-trash"
        icon="feather-trash"
        width="21"
        @click="cancelRecorder"
      />
      <iconify-icon
        class="icon icon-send"
        icon="feather-send"
        width="21"
        @click="sendRecord"
      />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      conversationId: {
        required: true,
        type: [String, Number],
      },
      isRecording: Boolean,
      isPlay: Boolean,
      isStop: Boolean,
      recordStripCount: {
        type: [Number, String],
        default: '',
      },
      recordList: {
        type: Array,
        default () {
          return []
        },
      },
      recordVolumes: {
        type: Array,
        default () {
          return []
        },
      },
      recordPlayCurrentTime: {
        type: [Number, String],
        default: '',
      },
      recordPlay: {
        type: [Object, HTMLAudioElement],
        default: new window.Audio(),
      },
      recorder: {
        type: Object,
        default: function () {
          return {}
        },
      },
    },
    data () {
      return {}
    },
    watch: {},
    mounted () {
      this.eventRecordPlayEnded()
      this.eventRecordPlayTimeUpdate()
    },
    methods: {
      isRecordStripActive (idx) {
        const duration = (this.recordPlay.duration * 1000)
        const part = (duration / this.recordStripCount)
        return (part * idx) <= (this.recordPlayCurrentTime * 1000)
      },
      switchPlayBackRecording () {
        const isPlay = !this.isPlay
        this.$emit('update:isPlay', !this.isPlay)
        if (!isPlay) {
          this.recordPlay.pause()
        } else {
          this.recordPlay.play()
        }
      },
      async sendRecord () {
        const type = 'send'
        const message = new FormData()
        message.append('files[0]', this.recordList[0].blob)
        message.set('conversation_id', this.conversationId)
        this.cancelRecorder()
        await this.$store.dispatch('chat/message/send', { type, message })
      },
      cancelRecorder () {
        this.deleteRecord()
        this.stopRecorder()
        this.$emit('update:isStop', false)
        this.$emit('update:recordPlay', {})
        this.removeRecordStrip()
      },
      removeRecordStrip () {
        this.$emit('update:recordVolumes', [])
      },
      deleteRecord () {
        this.$emit('update:recordList', [])
      },
      stopRecorder () {
        if (!this.isRecording) {
          return
        }
        this.$emit('update:isStop', true)
        this.recorder.stop()
        this.$emit('update:recordList', this.recorder.recordList())
        const recordPlay = new window.Audio()
        recordPlay.src = this.recorder.recordList()[0].url
        this.$emit('update:recordPlay', recordPlay)
      },
      eventRecordPlayEnded () {
        this.recordPlay.onended = () => {
          if (this.isPlay) this.$emit('update:isPlay', false)
        }
      },
      eventRecordPlayTimeUpdate () {
        this.recordPlay.ontimeupdate = () => {
          this.$emit('update:recordPlayCurrentTime', this.recordPlay.currentTime)
        }
      },
    },
  }
</script>
