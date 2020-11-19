<template>
  <div class="app--topic-bar-topic-delete">
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
  </div>
</template>

<script>

  export default {
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
