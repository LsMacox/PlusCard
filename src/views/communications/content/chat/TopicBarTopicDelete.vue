<template>
  <v-dialog
    v-model="dialog"
    max-width="350"
    persistent
  >
    <v-card class="modal-card">
      <div class="modal-header">
        Удалить тему?
      </div>

      <v-card-text />

      <v-card-actions>
        <div>
          <div
            class="close"
            @click="close()"
          >
            Отмена
          </div>
        </div>

        <v-spacer />

        <v-btn
          class="box-button"
          label=""
          icon="clear"
          :color="colors.buttons.success"
          :loading="loadingRequest"
          @click="remove()"
        >
          Удалить тему
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

  export default {
    components: {

    },
    props: {
      dialog: Boolean,
      deleteSuccess: Boolean,
      topicId: {
        type: Number,
        default: null,
      },
    },
    data () {
      return {

      }
    },
    computed: {
      loadingApp () {
        return this.$store.getters['template/shared/loadingApp']
      },
      loadingRequest () {
        return this.$store.getters['template/shared/loadingRequest']
      },
      colors () {
        return this.$store.getters['template/colors/colors']
      },
    },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
      async remove () {
        // чат-пользователь
        this.$store.dispatch('chat/topic/delete', this.topicId).then(() => {
          this.$emit('update:dialog', false)
          this.$emit('update:deleteSuccess', true)
        })
      },
    },
  }
</script>

<style scoped>
    .modal-header {
        margin-bottom: 50px;
        font-size: 24px;
        color: #687983;
        text-align: center;
    }

    .close {
        margin-top: 0px;
        font-size: 13px;
        line-height: 16px;
        color: rgba(51, 51, 51, .6);
        border-bottom: 1px dotted rgba(51, 51, 51, .6);
        cursor: pointer;
    }

    /* MEDIA */
    /* EXTRA SMALL */
    @media (max-width: 600px) {

    }

    /* SMALL */
    @media (min-width: 600px) and (max-width: 959.8px) {

    }

    /* MEDIUM */
    @media (min-width: 960px) and (max-width: 1263.8px) {

    }

    /* LARGE */
    @media (min-width: 1264px) and (max-width: 1903.8px) {

    }

    /* X LARGE */
    @media (min-width: 1904px) {

    }
</style>
