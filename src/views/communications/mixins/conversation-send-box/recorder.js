import Recorder from '@/utils/recorder'
import { convertTimeMMSS } from '@/utils'

export default {
  watch: {
    volume (v) {
      let newVolume = Math.round(v * this.recordStripMaxHeight)
      newVolume = (newVolume < this.recordStripMinHeight)
        ? this.recordStripMinHeight
        : newVolume
      this.recordVolumes.push(newVolume)
    },
    isRecording (v) {
    /// /console.log('records', this.recordList);
    },
  },
  computed: {
    attemptsLeft () {
      return this.attempts - this.recordList.length
    },
    isPause () {
      return this.recorder.isPause
    },
    isRecording () {
      return this.recorder.isRecording
    },
    recordedTime () {
      if (this.time && this.recorder.duration >= this.time * 60) {
        this.stopRecorder()
      }
      return convertTimeMMSS(this.recorder.duration)
    },
    volume () {
      return parseFloat(this.recorder.volume)
    },
    recordDuration () {
      return this.recorder.duration - this.tsNow(true) - this.startTime
    },
  },
  methods: {
    // async sendRecord () {
    //   const type = 'send'
    //   const message = new FormData()
    //   message.append('files[0]', this.recordList[0].blob)
    //   message.set('conversation_id', this.conversationId)
    //   this.cancelRecorder()
    //   await this.$store.dispatch('chat/message/send', { type, message })
    // },
    stopRecord () {
      this.stopRecorder()
      this.getRecorderStrip()
      this.eventRecordPlayEnded()
      this.eventRecordPlayTimeUpdate()
    },
    stopRecorder () {
      if (!this.isRecording) {
        return
      }
      this.isStop = true
      this.recorder.stop()
      this.recordList = this.recorder.recordList()
      this.recordPlay = new window.Audio()
      this.recordPlay.src = this.recordList[0].url
    },
    getRecorderStrip () {
      const takeCount = Math.floor(this.recordVolumes.length / this.recordStripCount)
      const allTakenCount = (this.recordStripCount * takeCount)
      this._prepareRecordVolumes(allTakenCount, takeCount)
    },
    // cancelRecorder () {
    //   this.stopRecorder()
    //   this.deleteRecord()
    //   this.isStop = false
    //   this.startTime = 0
    //   this.recordPlay = {}
    //   this.recordPlayCurrentTime = 0
    //   this.removeRecordStrip()
    // },
    toggleRecorder (e) {
      e.preventDefault()
      e.stopPropagation()
      if (this.attempts && this.recorder.records.length >= this.attempts) {
        return
      }
      if (!this.isRecording || (this.isRecording && this.isPause)) {
        this.recorder.start()
      } else {
        this.recorder.pause()
      }
    },
    // removeRecordStrip () {
    //   this.recordVolumes = []
    // },
    // switchPlayBackRecording () {
    //   this.isPlay = !this.isPlay
    //   if (!this.isPlay) {
    //     this.recordPlay.pause()
    //   } else {
    //     this.recordPlay.play()
    //   }
    // },
    // stopRecorder () {
    //   if (!this.isRecording) {
    //     return
    //   }
    //   this.isStop = true
    //   this.recorder.stop()
    //   this.recordList = this.recorder.recordList()
    //   this.recordPlay = new window.Audio()
    //   this.recordPlay.src = this.recordList[0].url
    // },
    // deleteRecord () {
    //   this.recordList.splice(0, 1)
    // },
    removeRecord (idx) {
      this.recordList.splice(idx, 1)
      this.$set(this.selected, 'url', null)
      this.$eventBus.$emit('remove-record')
    },
    choiceRecord (record) {
      if (this.selected === record) {
        return
      }
      this.selected = record
      this.selectRecord && this.selectRecord(record)
    },
    eventRecordPlayEnded () {
      this.recordPlay.onended = () => {
        if (this.isPlay) this.isPlay = false
      }
    },
    eventRecordPlayTimeUpdate () {
      this.recordPlay.ontimeupdate = () => {
        this.recordPlayCurrentTime = this.recordPlay.currentTime
      }
    },
    // isRecordStripActive (idx) {
    //   const duration = (this.recordPlay.duration * 1000)
    //   const part = (duration / this.recordStripCount)
    //   return (part * idx) <= (this.recordPlayCurrentTime * 1000)
    // },
    micFailed () {
      this.recorder.isRecording = false
    },
    _initRecorder () {
      return new Recorder({
        beforeRecording: this.beforeRecording,
        afterRecording: this.afterRecording,
        pauseRecording: this.pauseRecording,
        micFailed: this.micFailed,
        bitRate: 128,
        sampleRate: 44100,
        format: 'mp3',
      })
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
