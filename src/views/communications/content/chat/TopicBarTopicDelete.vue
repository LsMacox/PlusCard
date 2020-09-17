<template>
  <v-dialog
    v-model="dialogLocal"
    :max-width="300"
  >
    <template v-slot:activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <v-card>
      <v-card-title>
        <span class="modal-header">Удалить тему?</span>
      </v-card-title>
      <!-- <v-card-text>
        Название темы: {{}}
      </v-card-text> -->

      <v-divider />

      <v-card-actions>
        <v-btn
          text
          @click="close()"
        >
          Отмена
        </v-btn>
        <v-spacer />
        <v-btn
          color="success"
          :loading="topicDeleteRequest"
          @click="remove()"
        >
          <v-icon left>
            fa-trash
          </v-icon>
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
      topicId: {
        type: Number,
        required: true,
      },
    },
    data () {
      return {
        topicDeleteRequest: false,
      }
    },
    computed: {
      dialogLocal: {
        get () {
          return this.dialog
        },
        set (v) {
          this.$emit('update:dialog', v)
        },
      },
    },
    methods: {
      close () {
        this.dialogLocal = false
      },
      async remove () {
        // чат-пользователь
        this.topicDeleteRequest = true
        this.$store.dispatch('chat/topic/delete', this.topicId).then(() => {
          this.close()
          this.$emit('onDelete')
        }).finally(() => {
          this.topicDeleteRequest = false
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
