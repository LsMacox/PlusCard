<template>
  <div class="widget-line">
    <div class="widget-line-block">
      <company-client />
    </div>
    <div class="widget-line-block" />
    <div class="widget-line-block" />
    <div class="widget-line-block" />
  </div>
</template>

<script>
  import CompanyClient from '@/views/dashboard/widget/CompanyClient'

  export default {
    components: {
      CompanyClient,
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
.widget-line
  margin: 34px -10px 0 -10px
  display: flex
  align-items: center

  .widget-line-block
    margin: 0 10px
    width: 33.3333%
</style>
