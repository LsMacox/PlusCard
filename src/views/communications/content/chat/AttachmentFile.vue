<template>
  <div class="file">
    <div class="">
      Имя файла: {{ content.name }}
    </div>
    <div class="">
      Размер файла: {{ Math.round(Math.ceil(content.size/1024000) * 100) / 100 }} Мб
    </div>

    <a
      :href="content.url"
      class="url"
      target="_blank"
    >Скачать</a>
  </div>
</template>

<script>
  export default {
    props: {
      content: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {

      }
    },
  }
</script>

<style scoped>
    .file {
        font-size: 13px;
    }

    .url {
        font-size: 13px;
        color: #8C9499;
        border-bottom: 1px dotted #8C9499;
        cursor: pointer;
    }

    .url:hover {
        text-decoration: none;
    }
</style>
