<template>
  <div
    class="left-block__content body-m-regular"
    style="color: #70707D;"
  >
    <slot>{{ describe }}</slot>
  </div>
</template>

<script>
  export default {
    name: 'MasterFieldDescribe',
    props: {
      describe: {
        type: String,
        default: '',
      },
    },
    computed: {},
  }
</script>
