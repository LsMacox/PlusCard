import Recorder from '@/utils/recorder'

export default {
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
  },
  methods: {
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
    micFailed () {
      this.recorder.isRecording = false
    },
    _initRecorder () {
      return new Recorder({
        beforeRecording: this.beforeRecording,
        afterRecording: this.afterRecording,
        pauseRecording: this.pauseRecording,
        micFailed: this.micFailed,
        bitRate: 192,
        sampleRate: 44100,
        format: 'mp3',
      })
    },
  },
}
