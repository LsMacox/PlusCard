<template>
  <div class="loyalty-toolbar">
    <div class="loyalty-toolbar-name">
      {{ program.name }}
    </div>
    <div class="loyalty-toolbar-period">
      <item-select
        min-width="250px"
        :items="periods"
        :item.sync="period"
      />
    </div>
    <div class="app__spacer" />
    <div
      style="display: inline-grid; margin-right: 6px;"
    >
      <div
        class="loyalty-toolbar-text-btn"
        @click=""
      >
        <span
          class="iconify loyalty-toolbar-text-btn-icon"
          style="margin-right: 2px;"
          data-icon="ion:document-outline"
          data-inline="false"
        />
        Экспорт в XLS
      </div>
    </div>
    <div
      style="display: inline-grid; margin-left: 6px;"
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
        Настроить программу лояльности
      </v-btn>
    </div>
  </div>
</template>

<script>
  import ItemSelect from '@/components/dialogs/ItemSelect'

  export default {
    components: {
      ItemSelect,
    },
    props: {
    },
    data () {
      return {
        period: null,
        periods: [
          { name: 'За сегодня' },
          { name: 'За последние 7 дней' },
          { name: 'За последние 30 дней' },
          { name: 'За последние 90 дней' },
          { name: 'За последние 180 дней' },
          { name: 'За последние 365 дней' },
          { name: 'Собственный диапазон' },
        ],
      }
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

  .loyalty-toolbar-text-btn
    position: relative
    top: -2px
    margin-right: 2px
    font-style: normal
    font-weight: 600
    font-size: 13px
    line-height: 17px
    color: #4776E6
    cursor: pointer

    .loyalty-toolbar-text-btn-icon
      position: relative
      top: 4px
      font-size: 18px
</style>
