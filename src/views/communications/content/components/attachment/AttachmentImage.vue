<template>
  <div class="attachment-image">
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
