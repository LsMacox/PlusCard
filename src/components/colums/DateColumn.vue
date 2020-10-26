<template>
  <div>
    <div class="">
      {{ getDate(value) }}
    </div>
    <div class="body-xs-semibold neutral-600--text">
      {{ 'в\u00A0' + getTime(value) }}
    </div>
  </div>
</template>

  <script>
  import dateTimeFormat from '@/mixins/dateTimeFormat.js'

  export default {
    name: 'UserColumn',
    mixins: [dateTimeFormat],

    props: {
      value: {
        type: String,
        default: '',
      },
    },
    computed: {
    },
    methods: {},
  }
</script>
<style lang="scss" scoped>

</style>
