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
      top="10vh"
      class="previewDialog"
    >
      <div class="attachment--preview--toolbar">
        <a
          style="color:#fff"
          :href="content.url"
          target="_blank"
          download
        ><i class="fas fa-download" /></a>
        <i
          class="fas fa-times"
          style="font-size: 24px;position: relative;top: 1px;left: 25px;"
          @click="show = false"
        />
      </div>
      <img
        :src="content.url"
        class="image-full"
      >
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
    computed: {
    },
  }
</script>

<style lang="scss" scoped>
    .image-thumb {
        width: 150px;
        height: 150px;
        border-radius: 5px;
        cursor:pointer;
        background-color: #000000;
        padding: 5px;
        & > img{
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

    .close-icon{
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
            cursor:pointer;
            color:#fff;
            font-size: 20px;
            width:20px;
            height: 20px;
        }
    }
</style>

<style>
    .previewDialog .el-dialog{
        background-color: rgba(0,0,0,.8);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        height: 80vh;
        width: 50%;
        margin-top: 10vh;
    }
</style>
