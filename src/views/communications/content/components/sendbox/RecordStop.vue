<template>
  <div class="app-conversation--sendForm__message__record-stop">
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
          v-for="(v, i) in internalRecordVolumes"
          :key="i"
          class="strip"
          :class="[isRecordStripActive(i) ? 'active' : '']"
          :style="`height: ${v}px`"
        />
      </div>
      <div class="durations">
        <p class="body-m-regular neutral-600--text">
          {{ internalRecordPlayCurrentTime !== 0 ? this.$moment(internalRecordPlayCurrentTime * 1000).format('mm:ss') + '/' : '' }}{{ internalRecordList[0].duration }}
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
        type: HTMLAudioElement,
        default: function () {
          return {}
        },
      },
      recorder: {
        type: Object,
        default: function () {
          return {}
        },
      },
    },
    data () {
      return {
        internalRecordVolumes: Array.from(this.recordVolumes),
        internalRecorder: Object.assign({}, this.recorder),
        internalRecordList: this.recordList.map(a => Object.assign({}, a)),
        internalIsPlay: this.isPlay,
        internalIsStop: this.isStop,
        internalRecordPlay: this.recordPlay,
        internalRecordPlayCurrentTime: this.recordPlayCurrentTime,
      }
    },
    watch: {
      internalIsPlay (v) {
        this.$emit('update:isPlay', v)
      },
      internalIsStop (v) {
        this.$emit('update:isStop', v)
      },
      internalRecordPlayCurrentTime (v) {
        this.$emit('update:recordPlayCurrentTime', v)
      },
      internalRecorder: {
        deep: true,
        handler (v) {
          this.$emit('update:recorder', v)
        },
      },
      internalRecordVolumes: {
        deep: true,
        handler (v) {
          this.$emit('update:recordVolumes', v)
        },
      },
      internalRecordPlay: {
        deep: true,
        handler (v) {
          this.$emit('update:recordPlay', v)
        },
      },
      internalRecordList: {
        deep: true,
        handler (v) {
          console.log('this.internalRecordList')
          console.log(this.internalRecordList)
          this.$emit('update:recordList', v)
        },
      },
      // isPlay (v) {
      //   this.internalIsPlay = v
      // },
      // isStop (v) {
      //   this.internalIsStop = v
      // },
      // recorder (v) {
      //   this.internalRecorder = Object.assign({}, v)
      // },
      // recordList (v) {
      //   console.log('recordList change')
      //   this.internalRecordList = Array.from(v.map(a => Object.assign({}, a)))
      // },
      // recordVolumes (v) {
      //   this.internalRecordVolumes = Array.from(v.map(a => Object.assign({}, a)))
      // },
      // recordPlay (v) {
      //   this.internalRecordPlay = v
      // },
    },
    mounted () {
      console.log('mounted', this.internalRecordList)
    },
    methods: {
      isRecordStripActive (idx) {
        const duration = (this.internalRecordPlay.duration * 1000)
        const part = (duration / this.recordStripCount)
        return (part * idx) <= (this.internalRecordPlayCurrentTime * 1000)
      },
      switchPlayBackRecording () {
        this.internalIsPlay = !this.internalIsPlay
        if (!this.internalIsPlay) {
          this.internalRecordPlay.pause()
        } else {
          this.internalRecordPlay.play()
        }
      },
      async sendRecord () {
        const type = 'send'
        const message = new FormData()
        message.append('files[0]', this.internalRecordList[0].blob)
        message.set('conversation_id', this.conversationId)
        this.cancelRecorder()
        await this.$store.dispatch('chat/message/send', { type, message })
      },
      cancelRecorder () {
        this.stopRecorder()
        this.deleteRecord()
        this.internalIsStop = false
        this.internalRecordPlay = {}
        this.internalRecordPlayCurrentTime = 0
        this.removeRecordStrip()
      },
      removeRecordStrip () {
        this.internalRecordVolumes = []
      },
      deleteRecord () {
        this.internalExample = Object.assign([], this.internalExample)
      },
      stopRecorder () {
        if (!this.isRecording) {
          return
        }
        this.internalIsStop = true
        this.internalRecorder.stop()
        this.internalRecordList = this.internalRecorder.recordList()
        this.internalRecordPlay = new window.Audio()
        this.internalRecordPlay.src = this.internalRecordList[0].url
      },
    },
  }
</script>
