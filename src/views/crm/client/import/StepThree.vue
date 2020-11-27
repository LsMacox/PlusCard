<template>
  <div class="my-stepper-import--form">
    <div class="my-stepper-import--form-header title-m-bold">
      Результат импорта
    </div>
    <div
      v-if="importResult && !importResult.length"
      class="my-stepper-import--form-content"
    >
      <div class="my-stepper-import--step-three">
        <v-img
          src="@/assets/svg/auth-side-password-changed.svg"
          width="92px"
          height="79px"
          style="margin: 34px auto;"
        />
        Клиенты успешно загружены
      </div>
    </div>
    <div
      v-else
      class="my-stepper-import--form-content"
    >
      <div
        class="my-stepper-import--step-three"
        style="text-align: left; "
      >
        <div style="margin-bottom: 10px;">
          Клиенты загружены с ошибками
        </div>
        <div
          v-for="(item, i) in importResult"
          :key="i"
          class="my-stepper-import--step-three-error"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <div class="my-stepper-import--form-action">
      <div class="app__spacer" />
      <v-btn
        color="secondary"
        @click="back"
      >
        <iconify-icon
          icon="arrow-back"
          width="21"
          style="margin-right: 5px;"
        />
        В начало
      </v-btn>
    </div>
  </div>
</template>

<script>
  import convertor from '@/mixins/convertor'

  export default {
    mixins: [convertor],
    props: {
      step: {
        type: Number,
        default: 3,
      },
      excel: {
        type: Array,
        default: () => ([]),
      },
    },
    data () {
      return {
        valid: false,
        loading: false,
        rowStr: ['строка', 'строки', 'строк'],
      }
    },
    computed: {
      importResult () {
        return this.$store.getters['crm/client/importResult']
      },
    },
    methods: {
      back () {
        this.$emit('update:step', 1)
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
