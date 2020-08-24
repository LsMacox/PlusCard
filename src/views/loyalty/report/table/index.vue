<template>
  <div class="table-block">
    <toolbar />
    <app-table />
  </div>
</template>

<script>
  import Toolbar from './Toolbar'
  import AppTable from './Table'

  export default {
    components: {
      Toolbar,
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
  margin: 34px
</style>
