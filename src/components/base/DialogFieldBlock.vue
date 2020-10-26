<template>
  <v-container class="dialog-field-block pa-0">
    <v-row>
      <v-col class="body-l-semibold">
        {{ title }}
      </v-col>
    </v-row>
    <v-row>
      <v-col class="body-m-regular">
        {{ description }}
      </v-col>
    </v-row>
    <v-row>
      <v-col class="dialog-field-block__input">
        <slot name="default" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  export default {
    name: 'DialogFieldBlock',
    components: { },
    props: {      
      title: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
    },

    computed: {},
  }
</script>
<style lang="scss" scoped>

</style>
