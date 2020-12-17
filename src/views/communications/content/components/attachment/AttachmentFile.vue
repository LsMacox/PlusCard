<template>
  <div class="attachment-file">
    <div class="file">
      <p class="body-m-medium neutral-900--text mb-0">
        Имя файла: {{ content.name }}
      </p>
    </div>
    <p class="body-m-medium neutral-900--text mb-0">
      Размер файла: {{ Math.round(Math.ceil(content.size/1024000) * 100) / 100 }} Мб
    </p>
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
