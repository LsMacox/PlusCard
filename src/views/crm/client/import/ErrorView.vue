<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    @click:outside="close"
  >
    <v-card>
      <div class="content">
        <div class="header">
          <div
            v-if="type === 'error'"
            class="body-m-regular header-item header-status-error"
          >
            <v-icon>$iconify_bx-bxs-error-alt</v-icon>
            <span
              class="header-text"
            >{{ errors.length }} {{ declOfNum(errors.length, errorStr) }}
            </span>
          </div>
          <div
            v-if="type === 'warning'"
            class="body-m-regular header-item header-status-warning"
          >
            <v-icon>$iconify_bx-bxs-error</v-icon>
            <span
              class="header-text"
            >{{ errors.length }} {{ declOfNum(errors.length, warningStr) }}</span>
          </div>
        </div>
        <div
          v-for="(item, i) in errors"
          :key="i"
        >
          {{ item }}
        </div>
        <div class="action">
          <v-spacer />
          <v-btn
            color="secondary"
            @click="close"
          >
            Закрыть
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import convertor from '@/mixins/convertor'

  export default {
    mixins: [convertor],
    props: {
      dialog: {
        type: Boolean,
        default: false,
      },
      errors: {
        type: Array,
        default: () => ([]),
      },
      type: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        errorStr: ['ошибка', 'ошибки', 'ошибок'],
        warningStr: ['предупреждение', 'предупреждения', 'предупреждений'],
      }
    },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .header-item {
    margin-bottom: 15px;
    color: #f44336;
    cursor: pointer;

    .header-text {
      position: relative;
      top: -3px;
      margin-left: 7px;
    }
  }

  .header-status-error {
    color: #f44336;
  }

  .header-status-warning {
    color: #FF9800;
  }

  .content {
    padding: 25px;
  }

  .action{
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
</style>
