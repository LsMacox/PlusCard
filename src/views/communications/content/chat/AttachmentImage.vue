<template>
  <div>
    <div
      class="image-thumb"
      @click="show = true"
    >
      <img
        :src="content.thumb"
        alt=""
      >
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
              <img
                :src="content.url"
                class="image-full"
              >
            </v-col>
          </v-row>
        </v-container>

        <!-- <v-card-text>
          <v-row class="image-row" justify="center" align="center">
            <v-col cols="auto">
              <img
            :src="content.url"
            class="image-full"
          >
            </v-col>
          </v-row>

        </v-card-text> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      content: {
        required: true,
        type: Object,
      },
    },
    data () {
      return {
        show: false,
        download: false,
      }
    },
    computed: {},
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

.image-thumb {
  width: 150px;
  height: 150px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #000000;
  padding: 5px;
  & > img {
    width: calc(150px - 10px);
    height: calc(150px - 10px);
    pointer-events: none;
    object-fit: contain;
  }
}

.image-full {
  box-shadow: 0px 0px 5px 1px #343434;
  max-height: 70vh;
  max-width: 100%;
}

.image-back {
  position: relative;
  background-color: #ffffff;
}

.download {
  display: block;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: transparent;
  z-index: 2;
}

.download-icon {
  color: #ffffff;
  font-size: 40px;
}

.close-icon {
  position: absolute;
  z-index: 50;
  top: 5px;
  right: 7px;
}

.attachment--preview--toolbar {
  position: absolute;
  top: 10px;
  right: 40px;
  & i {
    cursor: pointer;
    color: #fff;
    font-size: 20px;
    width: 20px;
    height: 20px;
  }
}
</style>
