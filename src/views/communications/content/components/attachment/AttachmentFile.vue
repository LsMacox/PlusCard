<template>
  <div class="attachment-file">
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
