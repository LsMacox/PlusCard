<template>
  <div class="loyalty-toolbar">
    <div class="loyalty-toolbar-name">
      {{ program.name }}
    </div>
    <div class="loyalty-toolbar-period">
      <div>за сегодня</div>
      <div class="loyalty-toolbar-period-chevron">
        <span
          class="iconify"
          data-icon="feather:chevron-down"
          data-inline="false"
        />
      </div>
    </div>
    <div class="app__spacer" />
    <div
      style="display: inline-grid; margin-right: 6px;"
    >
      <v-btn
        color="secondary"
        small
        @click=""
      >
        <span
          class="iconify"
          style="margin-right: 8px;"
          data-icon="feather:settings"
          data-inline="false"
        />
        Настроить
      </v-btn>
    </div>
    <div
      style="display: inline-grid; margin-left: 6px;"
    >
      <v-btn
        color="primary"
        small
        @click=""
      >
        <span
          class="iconify"
          style="margin-right: 8px;"
          data-icon="ion:document-outline"
          data-inline="false"
        />
        Экспорт в XLS
      </v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
    },
    data () {
      return {}
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
    },
    mounted () {

    },
    methods: {

    },
  }
</script>

<style lang="sass" scoped>
.loyalty-toolbar
  display: flex
  align-items: center
  margin: 34px 34px 0 34px

  .loyalty-toolbar-name
    font-style: normal
    font-weight: bold
    font-size: 22px
    line-height: 26px
    letter-spacing: -0.2px
    color: #2A2A34

  .loyalty-toolbar-period
    display: flex
    align-items: flex-end
    margin-left: 12px
    font-style: normal
    font-weight: 600
    font-size: 17px
    line-height: 22px
    letter-spacing: 0.4px
    color: #4776E6
    cursor: pointer

    .loyalty-toolbar-period-chevron
      font-size: 24px
      position: relative
      top: 4px

</style>
