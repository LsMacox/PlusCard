<template>
  <v-dialog
    v-model="dialog"
    persistent
  >
    <div>
      <div>
        <v-btn
          color="secondary"
          @click="close"
        >
          <span
            class="iconify"
            data-icon="ant-design:plus-circle-outlined"
            data-inline="false"
          />
          Закрыть
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      dialog: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
      }
    },
    computed: {
    },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
    },
  }
</script>
