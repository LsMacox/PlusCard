<template>
  <div
    class="left-block__content body-m-regular"
    style="color: #70707D;"
  >
    <slot>{{ description }}</slot>
  </div>
</template>

<script>
  export default {
    name: 'MasterFieldDescription',
    props: {
      description: {
        type: String,
        default: '',
      },
    },
    computed: {},
  }
</script>
