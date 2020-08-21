<template>
  <div
    class="left-block__title title-m-bold"
    style="color: #2A2A34; margin-bottom: 10px"
  >
    <slot>{{ title }}</slot>
  </div>
</template>

<script>
  export default {
    name: 'MasterFieldTitle',
    props: {
      title: {
        type: String,
        default: '',
      },
    },

    computed: {},
  }
</script>
