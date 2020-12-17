<template>
  <div class="attachment-image">
    <div
      class="image-thumb"
      @click="show = true"
    >
      <img
        :src="content.thumb"
      >
    </div>

    <v-dialog
      v-if="show"
      v-model="show"
      max-width="80%"
      content-class="dialog-attachment-image-preview"
    >
      <div class="preview-img">
        <img
          :src="content.url"
          alt="image"
        >
      </div>
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
