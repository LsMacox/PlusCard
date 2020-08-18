<template>
  <v-dialog
    v-if="dialog === true"
    v-model="dialog"
    max-width="1200px"
    class="imageCropperWrapper"
  >
    <!-- Content -->
    <v-container
      v-if="!pCircle"
      style="background: #ffffff;"
    >
      <v-row>
        <v-col
          cols="12"
          md="9"
        >
          <!-- <h3>Demo:</h3> -->
          <div class="img-container">
            <img
              id="image"
              :src="selected"
              alt="Picture"
            >
          </div>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <!-- <h3>Preview:</h3> -->
          <div class="docs-preview clearfix">
            <div class="img-preview preview-lg" />
          </div>
        </v-col>
      </v-row>
      <v-row id="actions">
        <v-col cols="12">
          <v-btn-toggle>
            <v-btn
              :ripple="false"
              rounded
              small
              color="primary"
              style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
              @click="setDragMode('move')"
            >
              <v-icon color="#fff">
                fa-arrows-alt
              </v-icon>
            </v-btn>
            <v-btn
              :ripple="false"
              rounded
              small
              color="primary"
              style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
              @click="setDragMode('crop')"
            >
              <v-icon color="#fff">
                fa-crop-alt
              </v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle class="ml-1">
            <v-btn
              :ripple="false"
              rounded
              small
              color="primary"
              style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
              @click="zoom(0.1)"
            >
              <v-icon color="#fff">
                fa-search-plus
              </v-icon>
            </v-btn>
            <v-btn
              :ripple="false"
              rounded
              small
              color="primary"
              style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
              @click="zoom(-0.1)"
            >
              <v-icon color="#fff">
                fa-search-minus
              </v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle class="ml-1">
            <v-btn
              :ripple="false"
              rounded
              small
              color="primary"
              style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
              @click="move(-1, 0)"
            >
              <v-icon color="#fff">
                fa-arrow-left
              </v-icon>
            </v-btn>
            <v-btn
              :ripple="false"
              rounded
              small
              color="primary"
              style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
              @click="move(1, 0)"
            >
              <v-icon color="#fff">
                fa-arrow-right
              </v-icon>
            </v-btn>
            <v-btn
              :ripple="false"
              rounded
              small
              color="primary"
              style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
              @click="move(0, -1)"
            >
              <v-icon color="#fff">
                fa-arrow-up
              </v-icon>
            </v-btn>
            <v-btn
              :ripple="false"
              rounded
              small
              color="primary"
              style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
              @click="move(0, 1)"
            >
              <v-icon color="#fff">
                fa-arrow-down
              </v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle class="ml-1">
            <v-btn
              :ripple="false"
              rounded
              small
              color="primary"
              style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
              @click="setImage($event)"
            >
              <v-icon color="#fff">
                fa-upload
              </v-icon>
            </v-btn>
            <v-btn
              :ripple="false"
              rounded
              small
              color="primary"
              style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
              @click="cropImage"
            >
              <v-icon color="#fff">
                fa-check
              </v-icon>
            </v-btn>
          </v-btn-toggle>
          <!-- <h3>Toolbar:</h3> -->
        </v-col>
        <!-- /.docs-buttons -->
      </v-row>
    </v-container>
    <v-container
      v-else
      style="background: #ffffff;"
    >
      <div class="small-image-wrapper">
        <v-row>
          <v-col
            cols="12"
            md="9"
          >
            <!-- <h3>Demo:</h3> -->
            <div class="img-container">
              <img
                id="image"
                :src="selected"
                alt="Picture"
              >
            </div>
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <!-- <h3>Preview:</h3> -->
            <div class="docs-preview clearfix">
              <div class="img-small-preview preview-lg" />
            </div>
          </v-col>
        </v-row>
        <v-row id="actions">
          <v-col cols="12">
            <v-btn-toggle>
              <v-btn
                :ripple="false"
                rounded
                small
                color="primary"
                style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
                @click="setDragMode('move')"
              >
                <v-icon color="#fff">
                  fa-arrows-alt
                </v-icon>
              </v-btn>
              <v-btn
                :ripple="false"
                rounded
                small
                color="primary"
                style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
                @click="setDragMode('crop')"
              >
                <v-icon color="#fff">
                  fa-crop-alt
                </v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-btn-toggle class="ml-1">
              <v-btn
                :ripple="false"
                rounded
                small
                color="primary"
                style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
                @click="zoom(0.1)"
              >
                <v-icon color="#fff">
                  fa-search-plus
                </v-icon>
              </v-btn>
              <v-btn
                :ripple="false"
                rounded
                small
                color="primary"
                style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
                @click="zoom(-0.1)"
              >
                <v-icon color="#fff">
                  fa-search-minus
                </v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-btn-toggle class="ml-1">
              <v-btn
                :ripple="false"
                rounded
                small
                color="primary"
                style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
                @click="move(-1, 0)"
              >
                <v-icon color="#fff">
                  fa-arrow-left
                </v-icon>
              </v-btn>
              <v-btn
                :ripple="false"
                rounded
                small
                color="primary"
                style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
                @click="move(1, 0)"
              >
                <v-icon color="#fff">
                  fa-arrow-right
                </v-icon>
              </v-btn>
              <v-btn
                :ripple="false"
                rounded
                small
                color="primary"
                style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
                @click="move(0, -1)"
              >
                <v-icon color="#fff">
                  fa-arrow-up
                </v-icon>
              </v-btn>
              <v-btn
                :ripple="false"
                rounded
                small
                color="primary"
                style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
                @click="move(0, 1)"
              >
                <v-icon color="#fff">
                  fa-arrow-down
                </v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-btn-toggle class="ml-1">
              <v-btn
                :ripple="false"
                rounded
                small
                color="primary"
                style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
                @click="setImage($event)"
              >
                <v-icon color="#fff">
                  fa-upload
                </v-icon>
              </v-btn>
              <v-btn
                :ripple="false"
                rounded
                small
                color="primary"
                style="width:25px; height:15px;border-radius: 0; background: mediumblue !important"
                @click="cropImage"
              >
                <v-icon color="#fff">
                  fa-check
                </v-icon>
              </v-btn>
            </v-btn-toggle>
            <!-- <h3>Toolbar:</h3> -->
          </v-col>
          <!-- /.docs-buttons -->
        </v-row>
      </div>
    </v-container>
  </v-dialog>
</template>

<script>
  import Cropper from 'cropperjs'
  import 'cropperjs/dist/cropper.css'
  export default {
    name: 'ImageCropper',
    components: {
      // eslint-disable-next-line vue/no-unused-components
      Cropper,
    },
    props: {
      pDialog: Boolean,
      pTitle: {
        type: String,
        default: 'Загрузка логотипа',
      },
      pImg: {
        type: Object,
        default: undefined,
      },
      pSelected: {
        type: File,
        default: undefined,
      },
      pAspectRatio: {
        type: Number,
        default: 1,
      },
      pCircle: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        cropper: null,
        reader: null,
        image: {
          data: null,
          ext: null,
        },
        imgType: null,
        imgSrc: null,
      }
    },
    computed: {
      selected: {
        get () {
          /// ///console.log(this.pSelected);
          return this.pSelected
        },
        set (v) {
          this.$emit('update:pSelected', v)
        },
      },
      dialog: {
        get () {
          return this.pDialog
        },
        set (v) {
          this.$emit('update:pDialog', v)
        },
      },
      img: {
        get () {
          return this.pImg
        },
        set (v) {
          this.$emit('update:pImg', v)
        },
      },
      title: {
        get () {
          return this.pTitle
        },
      },

      aspectRatio: {
        get () {
          return this.pAspectRatio
        },
      },
    },
    mounted: function () {
      /// ///console.log('selected', this.pSelected);

      this.$nextTick(function () {
        /// /console.log('title', this.title);
        /// /console.log('ratio',this.aspectRatio);
        /// /console.log('circle',this.pCircle);
        if (this.selected) {
          let options, image
          /// ///console.log(this.selected);
          if (this.pCircle) {
            image = document.getElementById('image')
            /// ///console.log(image);
            options = {
              aspectRatio: this.aspectRatio,
              preview: '.img-small-preview',
              background: true,
              ready: function (e) {
                /// ///console.log(e.type);
              },
              cropstart: function (e) {
                /// ///console.log(e.type, e.detail.action);
              },
              cropmove: function (e) {
                /// ///console.log(e.type, e.detail.action);
              },
              cropend: function (e) {
                /// ///console.log(e.type, e.detail.action);
              },
              crop: function (e) {

                /// ///console.log(e.type);
              },
              zoom: function (e) {
                /// ///console.log(e.type, e.detail.ratio);
              },
            }
            this.cropper = new Cropper(image, options)
            this.imgType = this.selected.type.split('/')[1]
            this.reader = new FileReader()
            this.reader.onload = (event) => {
              this.imgSrc = event.target.result
              // rebuild cropperjs with the updated source
              this.cropper.replace(event.target.result)
            }
            this.reader.readAsDataURL(this.selected)
          } else {
            image = document.getElementById('image')
            /// ///console.log(image);
            options = {
              aspectRatio: this.aspectRatio,
              preview: '.img-preview',
              background: true,
              ready: function (e) {
                /// ///console.log(e.type);
              },
              cropstart: function (e) {
                /// ///console.log(e.type, e.detail.action);
              },
              cropmove: function (e) {
                /// ///console.log(e.type, e.detail.action);
              },
              cropend: function (e) {
                /// ///console.log(e.type, e.detail.action);
              },
              crop: function (e) {

                /// ///console.log(e.type);
              },
              zoom: function (e) {
                /// ///console.log(e.type, e.detail.ratio);
              },
            }
            this.cropper = new Cropper(image, options)
            this.imgType = this.selected.type.split('/')[1]
            this.reader = new FileReader()
            this.reader.onload = (event) => {
              this.imgSrc = event.target.result
              // rebuild cropperjs with the updated source
              this.cropper.replace(event.target.result)
            }
            this.reader.readAsDataURL(this.selected)
          }
        }
      })
    },
    methods: {
      resetDialog () {
        this.cropper = null
        this.reader = null
        this.image = {
          data: null,
          ext: null,
        }
        this.imgSrc = null
        this.dialog = false
      },
      getRoundedCanvas (sourceCanvas) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const width = sourceCanvas.width
        const height = sourceCanvas.height

        canvas.width = width
        canvas.height = height
        context.imageSmoothingEnabled = true
        context.drawImage(sourceCanvas, 0, 0, width, height)
        context.globalCompositeOperation = 'destination-in'
        context.beginPath()
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true)
        context.fill()
        return canvas
      },
      cropImage () {
        if (this.pCircle) {
          const sourceCanvas = this.cropper.getCroppedCanvas()

          const roundedCanvas = this.getRoundedCanvas(sourceCanvas)
          this.img = {
            data: roundedCanvas.toDataURL(),
            ext: this.imgType,
          }

          this.resetDialog()
        } else {
          /// ///console.log(this.cropper.getCroppedCanvas().toDataURL());
          this.img = {
            data: this.cropper.getCroppedCanvas().toDataURL(),
            ext: this.imgType,
          }
          this.resetDialog()
        }
      },
      move (x, y) {
        this.cropper.move(x, y)
      },
      zoom (ratio) {
        this.cropper.zoom(ratio)
      },
      setDragMode (method) {
        this.cropper.setDragMode(method)
      },
      replaceImage () {
        this.$refs.file.click()
      },
      setImage (e) {
        const file = e.target.files[0]
        this.imgType = file.type.split('/')[1]
        if (file.type.indexOf('image/') === -1) {
          return false
        }
        if (typeof FileReader === 'function') {
          this.reader = new FileReader()
          this.reader.onload = (event) => {
            this.imgSrc = event.target.result
            // rebuild cropperjs with the updated source
            this.cropper.replace(event.target.result)
          }
          this.reader.readAsDataURL(file)
        }

      /// ///console.log(file);
      },
    },

  }
</script>

<style lang="scss" scoped>
.imageCropperWrapper{
  background-color: #fff
}
.cropperDialog {

  /*# sourceMappingURL=bootstrap.css.map */
}
/* Ensure the size of the image fit the container perfectly */
img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
/*
.cropperContainer {
  margin: 20px auto;
  max-width: 480px;

}

.cropperContainerPreview {
  margin: 20px auto;
  max-width: 240px;
}

 .preview {
      overflow: hidden;
    }

.actionsRow{
  display:flex;
  justify-content: center;

  & .el-button-group{
    margin: 0 5px;
  }
}

.img-preview {
  float: left;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  overflow: hidden;
}

.img-preview > img {
  max-width: 100%;
}

.preview-lg {
  height: 9rem;
  width: 16rem;
}

.preview-md {
  height: 4.5rem;
  width: 8rem;
}

.preview-sm {
  height: 2.25rem;
  width: 4rem;
}

.preview-xs {
  height: 1.125rem;
  margin-right: 0;
  width: 2rem;
}  */

.btn {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

label.btn {
  margin-bottom: 0;
}

.d-flex > .btn {
  flex: 1;
}

.carbonads {
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  overflow: hidden;
  padding: 1rem;
}

.carbon-wrap {
  overflow: hidden;
}

.carbon-img {
  clear: left;
  display: block;
  float: left;
}

.carbon-text,
.carbon-poweredby {
  display: block;
  margin-left: 140px;
}

.carbon-text,
.carbon-text:hover,
.carbon-text:focus {
  color: #fff;
  text-decoration: none;
}

.carbon-poweredby,
.carbon-poweredby:hover,
.carbon-poweredby:focus {
  color: #ddd;
  text-decoration: none;
}

@media (min-width: 768px) {
  .carbonads {
    float: right;
    margin-bottom: -1rem;
    margin-top: -1rem;
    max-width: 360px;
  }
}

.footer {
  font-size: 0.875rem;
}

.heart {
  color: #ddd;
  display: block;
  height: 2rem;
  line-height: 2rem;
  margin-bottom: 0;
  margin-top: 1rem;
  position: relative;
  text-align: center;
  width: 100%;
}

.heart:hover {
  color: #ff4136;
}

.heart::before {
  border-top: 1px solid #eee;
  content: " ";
  display: block;
  height: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 50%;
}

.heart::after {
  background-color: #fff;
  content: "♥";
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  position: relative;
  z-index: 1;
}

.img-container,
.img-preview {
  text-align: center;
  width: 100%;
}

.img-container {
  margin-bottom: 1rem;
  max-height: 390px;
  min-height: 200px;
}

@media (min-width: 768px) {
  .img-container {
    min-height: 390px;
  }
}

.img-container > img {
  max-width: 100%;
}

.docs-preview {
  margin-right: -1rem;
}

.img-preview {
  float: left;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  overflow: hidden;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
  background-repeat: repeat;
  border: 1px dashed;
}

.img-preview > img {
  max-width: 100%;
}

.preview-lg {
  height: 9rem;
  width: 16rem;
}

.preview-md {
  height: 4.5rem;
  width: 8rem;
}

.preview-sm {
  height: 2.25rem;
  width: 4rem;
}

.preview-xs {
  height: 1.125rem;
  margin-right: 0;
  width: 2rem;
}

.docs-data > .input-group {
  margin-bottom: 0.5rem;
}

.docs-data .input-group-prepend .input-group-text {
  min-width: 4rem;
}

.docs-data .input-group-append .input-group-text {
  min-width: 3rem;
}

.docs-buttons > .btn,
.docs-buttons > .btn-group,
.docs-buttons > .form-control {
  margin-bottom: 0.5rem;
  margin-right: 0.25rem;
}

.docs-toggles > .btn,
.docs-toggles > .btn-group,
.docs-toggles > .dropdown {
  margin-bottom: 0.5rem;
}

.docs-tooltip {
  display: block;
  margin: -0.5rem -0.75rem;
  padding: 0.5rem 0.75rem;
}

.docs-tooltip > .icon {
  margin: 0 -0.25rem;
  vertical-align: top;
}

.tooltip-inner {
  white-space: normal;
}

.btn-upload .tooltip-inner,
.btn-toggle .tooltip-inner {
  white-space: nowrap;
}

.btn-toggle {
  padding: 0.5rem;
}

.btn-toggle > .docs-tooltip {
  margin: -0.5rem;
  padding: 0.5rem;
}

@media (max-width: 400px) {
  .btn-group-crop {
    margin-right: -1rem !important;
  }

  .btn-group-crop > .btn {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .btn-group-crop .docs-tooltip {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

.docs-options .dropdown-menu {
  width: 100%;
}

.docs-options .dropdown-menu > li {
  font-size: 0.875rem;
  padding: 0.125rem 1rem;
}

.docs-options .dropdown-menu .form-check-label {
  display: block;
}

.docs-cropped .modal-body {
  text-align: center;
}

.docs-cropped .modal-body > img,
.docs-cropped .modal-body > canvas {
  max-width: 100%;
}

.img-small-preview {
  float: left;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  overflow: hidden;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
  background-repeat: repeat;
  border: 1px dashed;
}

.img-small-preview > img {
  max-width: 100%;
}

.preview-lg {
  height: 9rem;
  width: 16rem;
}

.preview-md {
  height: 4.5rem;
  width: 8rem;
}

.preview-sm {
  height: 2.25rem;
  width: 4rem;
}

.preview-xs {
  height: 1.125rem;
  margin-right: 0;
  width: 2rem;
}

.docs-data > .input-group {
  margin-bottom: 0.5rem;
}

.docs-data .input-group-prepend .input-group-text {
  min-width: 4rem;
}

.docs-data .input-group-append .input-group-text {
  min-width: 3rem;
}

.docs-buttons > .btn,
.docs-buttons > .btn-group,
.docs-buttons > .form-control {
  margin-bottom: 0.5rem;
  margin-right: 0.25rem;
}

.docs-toggles > .btn,
.docs-toggles > .btn-group,
.docs-toggles > .dropdown {
  margin-bottom: 0.5rem;
}

.docs-tooltip {
  display: block;
  margin: -0.5rem -0.75rem;
  padding: 0.5rem 0.75rem;
}

.docs-tooltip > .icon {
  margin: 0 -0.25rem;
  vertical-align: top;
}

.tooltip-inner {
  white-space: normal;
}

.btn-upload .tooltip-inner,
.btn-toggle .tooltip-inner {
  white-space: nowrap;
}

.btn-toggle {
  padding: 0.5rem;
}

.btn-toggle > .docs-tooltip {
  margin: -0.5rem;
  padding: 0.5rem;
}

@media (max-width: 400px) {
  .btn-group-crop {
    margin-right: -1rem !important;
  }

  .btn-group-crop > .btn {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .btn-group-crop .docs-tooltip {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

.docs-options .dropdown-menu {
  width: 100%;
}

.docs-options .dropdown-menu > li {
  font-size: 0.875rem;
  padding: 0.125rem 1rem;
}

.docs-options .dropdown-menu .form-check-label {
  display: block;
}

.docs-cropped .modal-body {
  text-align: center;
}

.docs-cropped .modal-body > img,
.docs-cropped .modal-body > canvas {
  max-width: 100%;
}
</style>

<style lang="scss">
.cropper-bg {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
  background-repeat: repeat;
}

.btn-primary {
  background-color: #409eff;
  border-color: #409eff;
  &:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
}

.el-dialog.el-dialog--center.cropperDialog .el-dialog__body {
  padding: 0 25px;
}

.small-image-wrapper {
  .cropper-view-box,
  .cropper-face,
  .img-small-preview {
    border-radius: 50%;
  }
}
</style>
