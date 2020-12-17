<template>
  <v-row
    no-gutters
    style="margin: 0px -4px"
    align="center"
  >
    <v-col
      cols="auto"
      style="margin: 0px 4px; height: 21px;"
    >
      <v-icon>{{ icon }}</v-icon>
    </v-col>
    <v-col style="margin: 0px 4px">
      <span :class="color? color+'--text' : ''">
        {{ text }}
      </span>
    </v-col>
  </v-row>
</template>

  <script>

  export default {
    name: 'StatusColumn',

    props: {
      icon: {
        type: String,
        default: '',
      },
      text: {
        type: String,
        default: '',
      },
      color: {
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
