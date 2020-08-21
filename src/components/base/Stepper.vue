<template>
  <v-container>
    <v-stepper v-model="value">
      <v-stepper-header>
        <v-stepper-step
          v-for="(item, index) in items"
          :key="index"
          :complete="value>index"
          :step="index"
        >
          {{ item.title }}
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
  </v-container>
</template>

<script>
  export default {
    name: 'Stepper',

    props: {
      items: {
        type: Array,
        default: [],
      },
      value: {
        type: Number,
        default: 0,
      },
    },

    computed: {},
  }
</script>
