<template>
  <div class="table-block">
    <app-filter />
    <app-table />
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

    },
    mounted () {

    },
    methods: {

    },
  }
</script>

<style lang="sass" scoped>
.table-block
  margin: 34px 0 0 0
</style>
