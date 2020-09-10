<template>
  <div>
    <dashboard
      v-if="programs && programs.length"
    />
    <empty-company
      v-else
    />
  </div>
</template>

<script>
  import Dashboard from './Dashboard'
  import EmptyCompany from './EmptyCompany'
  export default {
    components: {
      Dashboard,
      EmptyCompany,
    },
    data () {
      return {}
    },
    computed: {
      programs () {
        return this.$store.getters['company/program/programs']
      },
    },
  }
</script>
