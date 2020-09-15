<template>
  <div class="card-wrapper">
    <div class="card-shadow" />
    <div
      class="card-block"
      :style="'background: linear-gradient(109deg,'+ program.bgcolor1 + ' 0% ,' + program.bgcolor2 + ' 99.35%);'"
    >
      <div
        class="card-header"
        :style="`color: ${program.color};`"
      >
        {{ program.name ? program.name : 'Ваша компания' }}
      </div>
      <div
        class="card-footer"
        :style="`color: ${program.color};`"
      >
        <div class="card-number">
          1234567891236
        </div>
        <div class="card-balance">
          123 <span>бонуса</span>
        </div>
      </div>

      <div class="card-color-menu">
        <v-menu
          v-model="colorPickerMenu"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <div
              style="cursor: pointer"
              v-on="on"
            >
              <iconify-icon
                icon="ion-color-fill-outline"
                height="21"
                :style="`color: ${program.color};`"
              />
            </div>
          </template>
          <div class="colorPickerWrapper">
            <div class="pa-2">
              <v-color-picker
                v-model="program.bgcolor1"
                hide-mode-switch
                mode="hexa"
                flat
                @input="changeColor"
              />
            </div>
          </div>
        </v-menu>
      </div>

      <div class="card-logo-menu">
        <div
          v-if="!program.logo"
          :style="'cursor: pointer;border: 1px solid '+ getBorderColor() +' ;border-radius: 50%;width: 58px;height: 58px;display: flex;align-items: center;justify-content: center;'"
          @click="$refs.smallImg.click()"
        >
          <iconify-icon
            icon="feather-download"
            height="21"
            :style="`color: ${program.color};`"
          />
        </div>
        <v-img
          v-else
          :src="program.logo"
          width="58px"
          height="58px"
          style="cursor:pointer;border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%"
          @click="$refs.smallImg.click()"
        />
      </div>

      <input
        ref="smallImg"
        type="file"
        class="sr-only"
        name="file"
        accept="image/*"
        hidden
        @change="setSmallImage($event)"
      >
      <image-cropper
        v-if="cropperSmallDialog"
        :p-dialog.sync="cropperSmallDialog"
        :p-title="'Загрузка логотипа'"
        :p-img.sync="smallImg"
        :p-selected.sync="selectedImg"
        :p-aspect-ratio="1"
        :p-circle="true"
      />
    </div>
  </div>
</template>

<script>
  import ImageCropper from '@/components/dialogs/ImageCropper'
  import Color from 'color'

  export default {
    components: {
      ImageCropper,
    },
    props: {
      program: {
        type: Object,
        // eslint-disable-next-line vue/require-valid-default-prop
        default: {},
      },
    },
    data () {
      return {
        colorPickerMenu: false,
        cropperSmallDialog: false,
        cardBg: require('@/assets/svg/Shine.svg'),
        smallImg: {
          data: null,
          mime: null,
        },
        fileLogo: {
          data: null,
          mime: null,
        },
        selectedImg: null,
      }
    },
    watch: {
      smallImg (v) {
        if (v.data.indexOf('base64') !== -1) {
          this.fileLogo = {
            data: v.data.split(',')[1],
            mime: 'image/png',
          }
          this.program.logo = v.data
        }
      },
    },
    created () {
      this.changeColor(this.program.bgcolor1)
    },
    methods: {
      getUnitColor () {
        if (this.program.color === '#FFFFFF') { return 'rgba(255, 255, 255, 0.5)' } else { return 'rgba(0, 0, 0, 0.5)' }
      },
      getBorderColor () {
        if (this.program.color === '#FFFFFF') { return 'rgba(255, 255, 255, 0.2)' } else { return 'rgba(0, 0, 0, 0.2)' }
      },
      ColorToStr (rgb, mask, alpha) {
        let red, green, blue
        red = rgb[0] + (mask - rgb[0]) * alpha
        green = rgb[1] + (mask - rgb[1]) * alpha
        blue = rgb[2] + (mask - rgb[2]) * alpha

        red = red ? this.dechex(red) : '00'
        green = green ? this.dechex(green) : '00'
        blue = blue ? this.dechex(blue) : '00'

        if (red.length === 1) red = '0' + red
        if (green.length === 1) green = '0' + green
        if (blue.length === 1) blue = '0' + blue

        return '#' + red + green + blue
      },
      dechex (number) {
        if (number < 0) {
          number = 0xFFFFFFFF + number + 1
        }
        return parseInt(number, 10)
          .toString(16)
      },
      changeColor (str) {
        const color = Color(str)
        let alpha, mask
        if (color.isLight()) {
          alpha = 0.04
          mask = 0
          this.program.bgcolor2 = this.ColorToStr(color.rgb().array(), mask, alpha)
          this.program.color = '#2A2A34'
          // //console.log('color', this.program.bgcolor2)
        } else {
          alpha = 0.1
          mask = 255
          this.program.bgcolor2 = this.ColorToStr(color.rgb().array(), mask, alpha)
          this.program.color = '#FFFFFF'
          // //console.log('color', this.program.bgcolor2)
        }
      },
      setSmallImage (e) {
        this.selectedImg = e.target.files[0]
        this.cropperSmallDialog = true
        e.target.type = 'text'
        e.target.type = 'file'
      },
    },
  }
</script>

<style lang="scss" scoped>
.card-wrapper {
  position: relative;
  width: 300px;
  height: 152px;

  .card-shadow {
    position: absolute;
    bottom: 0;
    left: 12px;
    width: 276px;
    height: 140px;
    border-radius: 12px;
    box-shadow: 0 7px 50px rgba(0, 22, 38, 0.4);
    z-index: 1;
  }

  .card-block {
    position: relative;
    width: 300px;
    height: 152px;
    border-radius: 12px;
    z-index: 2;

    .card-header {
      position: absolute;
      top: 16px;
      left: 16px;
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      line-height: 24px;
    }

    .card-footer {
      position: absolute;
      left: 16px;
      bottom: 20px;

      .card-number {
        margin-bottom: 1px;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 17px;
      }

      .card-balance {
        font-style: normal;
        font-weight: bold;
        font-size: 20px;
        line-height: 24px;

        span {
          font-style: normal;
          font-weight: 600;
          font-size: 11px;
          line-height: 14px;
          //color: rgba(255, 255, 255, 0.5);
        }
      }
    }

    .card-color-menu {
      position: absolute;
      top: 18px;
      right: 18px;
    }

    .card-logo-menu {
      position: absolute;
      bottom: 12px;
      right: 12px;
    }
  }
}

.colorPickerWrapper {
  background-color: #ffffff;
}
</style>
