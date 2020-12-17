<template>
  <div class="attachment-audio">
    <div
      class="audio"
    >
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
      <div
        v-if="isAudioLoaded"
        class="strips"
      >
        <div
          v-for="(v, i) in volumeStrip"
          :key="i"
          class="strip"
          :class="[isRecordStripActive(i) ? 'active' : '']"
          :style="`height: ${v}px`"
        />
      </div>
      <div
        v-else
        class="strips strips--loading"
      >
        <div
          v-for="(v, i) in audioDefault.strip"
          :key="i"
          class="strip"
          :class="[v.active ? 'active' : '']"
          :style="`height: 4px`"
        />
      </div>
      <div class="durations">
        <p class="body-m-regular neutral-600--text">
          {{ isAudioLoaded && isPlay ? recordedTime : recordDuration }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { convertTimeMMSS } from '@/utils'

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
        isPlay: false,
        recordStripCount: 52,
        recordStripMaxHeight: 21,
        recordStripMinHeight: 4,
        audioCurrentTime: NaN,
        isAudioLoaded: false,
        isAudioLoading: false,
        recordVolumes: [],
        recordDuration: '00:00',
        audioPlay: new Audio(),
        audioCtx: new (window.AudioContext || window.webkitAudioContext)(),
        audioSource: {}, // initAudioData
        audioStripInterval: null,
        audioDefault: {
          strip: Array(52).fill({ active: false }),
        },
      }
    },
    computed: {
      recordedTime () {
        if (this.audioCurrentTime) {
          return convertTimeMMSS(this.audioCurrentTime)
        }
        return '00:00'
      },
      volumeStrip () {
        const takeCount = Math.floor(this.recordVolumes.length / this.recordStripCount)
        const allTakenCount = (this.recordStripCount * takeCount)
        this._prepareRecordVolumes(allTakenCount, takeCount)
        return this.recordVolumes
      },
    },
    watch: {
      isAudioLoaded (v) {
        if (v) {
          if (this.audioStripInterval) {
            clearInterval(this.audioStripInterval)
          }
          this.recordDuration = convertTimeMMSS(this.audioSource.buffer.duration)
          this.loadVolumes()
        }
      },
      isAudioLoading (v) {
        if (v) {
          const _vm = this
          this.audioStripInterval = setInterval(() => {
            const bandCount = 5
            const activeIdx = _vm.audioDefault.strip.findIndex(a => a.active)
            _vm.audioDefault.strip = _vm.audioDefault.strip.map(a => { return { active: false } })
            if (activeIdx !== -1) {
              if (activeIdx + (bandCount * 2) + 1 < _vm.audioDefault.strip.length) {
                for (let i = activeIdx + bandCount; i < activeIdx + (bandCount * 2); i++) {
                  _vm.audioDefault.strip[i] = { active: true }
                }
              } else {
                for (let i = 0; i < bandCount; i++) {
                  _vm.audioDefault.strip[i] = { active: true }
                }
              }
            } else {
              for (let i = 0; i < bandCount; i++) {
                _vm.audioDefault.strip[i] = { active: true }
              }
            }
          }, 100)
        }
      },
    },
    async mounted () {
      await this.loadData()
      this.eventAudioPlayTimeUpdate()
      this.eventAudioPlayEnded()
    },
    methods: {
      async switchPlayBackRecording () {
        if (this.isAudioLoading) {
          this.$notify({
            type: 'error',
            group: 'api',
            title: 'Загрузка...',
            text: 'Пожалуйста подождите! <br> Аудиосообщение загружается',
          })
          return
        } else if (!this.isAudioLoaded) {
          await this.loadData()
          return
        }

        if (this.isPlay) {
          this.audioPlay.pause()
        } else {
          this.audioPlay.play()
        }
        this.isPlay = !this.isPlay
      },
      isRecordStripActive (idx) {
        const duration = (this.audioPlay.duration * 1000)
        const part = (duration / this.recordStripCount)
        return (part * idx) <= (this.audioCurrentTime * 1000)
      },
      async loadData () {
        this.audioPlay.src = this.content.url
        await this.initAudioData()
      },
      loadVolumes () {
        const volumes = []
        const buffer = this.audioSource.buffer.getChannelData(0)
        const bufferSize = 512
        let part = 1

        while ((bufferSize * part) < buffer.length) {
          const sampleSize = (bufferSize * part)
          part++
          let sum = 0.0
          for (let i = sampleSize - bufferSize; i < sampleSize; ++i) {
            sum += buffer[i] * buffer[i]
          }
          const volume = parseFloat(Math.sqrt(sum / sampleSize).toFixed(4))
          let newVolume = Math.round((volume * 16000) / this.recordStripMaxHeight)

          if (newVolume < this.recordStripMinHeight) {
            newVolume = this.recordStripMinHeight
          } else if (newVolume > this.recordStripMaxHeight) {
            newVolume = this.recordStripMaxHeight
          }

          volumes.push(newVolume)
        }

        this.recordVolumes = volumes
      },
      async initAudioData () {
        this.audioSource = this.audioCtx.createBufferSource()
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        this.isAudioLoading = true
        fetch(proxyUrl + this.content.url)
          .then(response => response.arrayBuffer())
          .then(res => this.audioCtx.decodeAudioData(res))
          .then(buffer => {
            this.isAudioLoaded = true
            this.audioSource.buffer = buffer
            this.audioSource.connect(this.audioCtx.destination)
          })
          .finally(() => {
            this.isAudioLoading = false
          })
      },
      _prepareRecordVolumes (allTakenCount, takeCount) {
        const awayCount = (allTakenCount > this.recordVolumes.length)
          ? (allTakenCount - this.recordVolumes.length)
          : (this.recordVolumes.length - allTakenCount)

        const startPos = Math.floor(this.recordVolumes.length / 2)
        this.recordVolumes.splice(startPos, awayCount)

        const recordVolumes = this.recordVolumes.filter((volume, i) => (i % takeCount) === 0, takeCount)
        this.recordVolumes = recordVolumes
      },
      eventAudioPlayEnded () {
        this.audioPlay.onended = () => {
          if (this.isPlay) this.isPlay = false
        }
      },
      eventAudioPlayTimeUpdate () {
        this.audioPlay.ontimeupdate = () => {
          this.audioCurrentTime = this.audioPlay.currentTime
        }
      },
    },
  }
</script>
