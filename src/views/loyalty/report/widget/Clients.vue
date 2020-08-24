<template>
  <div class="widget-box">
    <div class="widget-box-header">
      <div class="widget-box-header-left">
        <span>58</span> клиентов
      </div>
      <div class="app__spacer" />
      <div class="widget-box-header-right">
        <span>+117 %</span>
      </div>
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

    },
    mounted () {

    },
    methods: {

    },
  }
</script>

<style lang="sass" scoped>
#canvas
  width: 100%
  height: 200px

.widget-box
  padding: 20px
  border: 1px solid #F2F2F7
  box-sizing: border-box
  border-radius: 12px

  .widget-box-header
    display: flex
    align-items: center

    .widget-box-header-left
      font-style: normal
      font-weight: 600
      font-size: 15px
      line-height: 21px
      letter-spacing: 0.1px
      color: #2A2A34
      span
        color: #4776E6

    .widget-box-header-right
      font-style: normal
      font-weight: 600
      font-size: 15px
      line-height: 21px
      letter-spacing: 0.1px
      color: #00D15D
      span
        color: #00D15D
</style>
