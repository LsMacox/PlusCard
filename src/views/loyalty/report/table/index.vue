<template>
  <div class="table-block">
    <app-filter />
    <app-table v-show="tableData.length" />
    <div
      v-show="!tableData.length"
    >
      <dummy-screen />
    </div>
  </div>
</template>

<script>
  import AppFilter from './Filter'
  import AppTable from './Table'
  import DummyScreen from '@/views/loyalty/DummyScreen'

  export default {
    components: {
      AppFilter,
      AppTable,
      DummyScreen,
    },
    props: {
    },
    data () {
      return {}
    },
    computed: {
      tableData () {
        return this.$store.getters['widget/table/widgetData']
      },
    },
    mounted () {

    },
    methods: {

    },
  }
</script>

<style lang="scss" scoped>
.table-block {
  margin: 24px 0 0 0;
}

.dummy-screen {
  margin: 100px 0;

  .dummy-screen-img {
    margin: 0 auto;
    width: 186px;
    height: 156px;
  }

  .dummy-screen-header {
    margin: 34px auto 0 auto;
    max-width: 500px;
    text-align: center;
  }

  .dummy-screen-text {
    margin: 12px auto 0 auto;
    max-width: 500px;
    text-align: center;
  }
}
</style>
