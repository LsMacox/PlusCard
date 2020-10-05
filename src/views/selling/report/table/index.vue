<template>
  <div class="table-block">
    <!--
    <app-filter />
    -->
    <app-table v-show="tableData.length" />
    <div
      v-show="!tableData.length"
      class="dummy-screen"
    >
      <v-img
        class="dummy-screen-img"
        src="@//assets/png/loyalty-dummy.png"
      />
      <div class="dummy-screen-header title-s-bold">
        Здесь пока ничего нет :’(
      </div>
      <div class="dummy-screen-text body-m-regular">
        Здесь отображается информация по операциям програмы лояльности. По текущим настройкам фильтра или периода данных нет.
      </div>
    </div>
  </div>
</template>

<script>
  import AppFilter from './Filter'
  import AppTable from './Table'

  export default {
    components: {
      AppFilter,
      AppTable,
    },
    props: {
    },
    data () {
      return {}
    },
    computed: {
      tableData () {
        return this.$store.getters['selling/table/tableData']
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
