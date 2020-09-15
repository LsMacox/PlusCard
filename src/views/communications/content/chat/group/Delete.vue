<template>
  <v-dialog
    v-model="dialog"
    custom-class="app--modal"
  >
    <div class="modal">
      <div class="header">
        Удалить группу?
      </div>

      <div class="content">
        <div>Название: {{ item.name }}</div>
      </div>

      <div class="action">
        <v-btn
          @click="close()"
        >
          Отмена
        </v-btn>

        <v-spacer />

        <v-btn
          color="error"
          :loading="groupDeleteAction"
          @click="remove()"
        >
          Удалить
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
  export default {

    props: {
      dialog: Boolean,
      item: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        groupDeleteAction: false,
      }
    },
    computed: { },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
      remove () {
        const group = {
          id: this.item.id,
        }
        /// /console.log(group)
        this.groupDeleteAction = true
        this.$store.dispatch('chat/group/delete', group).then(() => {
          this.close()
        }).finally(() => {
          this.groupDeleteAction = false
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/components/_modal.scss";

.modal {
    min-width: 400px;
}

.content {
    margin: 0 0 20px 0;
    padding: 0 !important;
    max-height: 60vh;
    overflow-y: auto;
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
