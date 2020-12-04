<template>
  <div
    class="app-conversation--sendForm__message__record"
  >
    <div class="record-time">
      <p class="body-m-regular neutral-600--text">
        {{ recordedTime }}
      </p>
    </div>
    <div class="left-block">
      <v-btn
        class="record-cancel"
        color="primary-100"
        @click="cancelRecorder()"
      >
        <iconify-icon
          class="icon-close"
          icon="jam-close"
          width="21"
        />
      </v-btn>
      <v-btn
        class="record-stop"
        color="error"
        @click="stopRecord()"
      >
        <div
          class="stop-overlay"
          :style="`width: calc(130px + ${Math.round(volume * 60)}px);
                   height: calc(130px + ${Math.round(volume * 60)}px);`"
        />
        <iconify-icon
          class="icon-stop"
          icon="carbon-stop"
          width="21"
        />
      </v-btn>
    </div>
  </div>
</template>

<script>
  import { convertTimeMMSS } from '@/utils'

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
      recordStripMaxHeight: {
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
    computed: {
      recordedTime () {
        if (this.recorder.duration >= 1800) {
          this.stopRecorder()
        }
        return convertTimeMMSS(this.recorder.duration)
      },
      volume () {
        return parseFloat(this.recorder.volume)
      },
    },
    watch: {
      volume (v) {
        let newVolume = Math.round((v * 1000) / this.recordStripMaxHeight)
        newVolume = (newVolume < this.recordStripMinHeight)
          ? this.recordStripMinHeight
          : newVolume
        this.recordVolumes.push(newVolume)
      },
    },
    mounted () {},
    methods: {
      cancelRecorder () {
        this.stopRecorder()
        this.deleteAllRecords()
        this.$emit('update:recordList', [])
        this.$emit('update:isStop', false)
        this.$emit('update:recordPlay', {})
        this.$emit('update:recordPlayCurrentTime', 0)
        this.deleteRecordStrip()
      },
      stopRecord () {
        this.stopRecorder()
        this.getRecorderStrip()
      },
      getRecorderStrip () {
        const takeCount = Math.floor(this.recordVolumes.length / this.recordStripCount)
        const allTakenCount = (this.recordStripCount * takeCount)
        this._prepareRecordVolumes(allTakenCount, takeCount)
      },
      stopRecorder () {
        if (!this.isRecording) {
          return
        }
        this.$emit('update:isStop', true)
        this.recorder.stop()
        this.deleteOldRecord()
        const recordList = this.recorder.recordList()
        this.$emit('update:recordList', recordList)
        this.$emit('update:recordPlayCurrentTime', 0)
        const recordPlay = new window.Audio()
        recordPlay.src = recordList[0].url
        this.$emit('update:recordPlay', recordPlay)
      },
      deleteRecordStrip () {
        this.$emit('update:recordVolumes', [])
      },
      deleteOldRecord () {
        if (this.recorder.records.length > 1) {
          this.recorder.records.shift()
        }
      },
      deleteAllRecords () {
        this.recorder.records = []
      },
      _prepareRecordVolumes (allTakenCount, takeCount) {
        if (takeCount > 0) {
          const awayCount = (allTakenCount > this.recordVolumes.length)
            ? (allTakenCount - this.recordVolumes.length)
            : (this.recordVolumes.length - allTakenCount)

          const startPos = Math.floor(this.recordVolumes.length / 2)
          this.recordVolumes.splice(startPos, awayCount)

          this.recordVolumes = this.recordVolumes.filter((volume, i) => {
            return (i % takeCount) === 0
          }, takeCount)
        } else {
          this._addMinStripCountRecordVolumes()
        }
      },
      _addMinStripCountRecordVolumes () {
        const addCount = (this.recordStripCount - this.recordVolumes.length)
        const fillArr = new Array(addCount).fill(this.recordStripMinHeight)
        this.recordVolumes.unshift(...fillArr)
      },
    },
  }
</script>
