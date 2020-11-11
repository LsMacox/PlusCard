<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col class="body-l-semibold">
          Данные сертификата
        </v-col>
      </v-row>
      <v-row>
        <v-col
          class="body-s-semibold"
          cols="4"
        >
          Название:
        </v-col>
        <v-col>{{ cert.certificate.name }}</v-col>
      </v-row>
      <v-row>
        <v-col
          class="body-s-semibold"
          cols="4"
        >
          № заказа:
        </v-col>
        <v-col>{{ cert.order.num }}</v-col>
      </v-row>
      <v-row>
        <v-col
          class="body-s-semibold"
          cols="4"
        >
          ID сертификата:
        </v-col>
        <v-col>{{ cert.number || cert.id }} </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    components: {},
    mixins: [],
    props: {
      cert: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {}
    },
    computed: {},
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
</style>
