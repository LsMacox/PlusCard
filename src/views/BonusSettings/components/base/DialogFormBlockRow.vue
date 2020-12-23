<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col class="body-l-semibold">
          {{ title }}
        </v-col>
      </v-row>
      <v-row>
        <v-col class="body-m-regular neutral-700--text">
          {{ desc }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <slot />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'DialogFormBlockRow',

    props: {
      title: {
        type: String,
        default: undefined,
      },
      desc: {
        type: String,
        default: undefined,
      },

    },
  }
</script>
