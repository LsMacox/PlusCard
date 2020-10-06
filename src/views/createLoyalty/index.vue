<template>
  <div>
    <div class="loyalty-wrap">
      <toolbar />
      <div class="main-wrap">
        <create-loyalty-main />
<!--        <switch-control />-->
      </div>
    </div>
    <navigation-drawers-right />
  </div>
</template>

<script>
  import Toolbar from '@/views/createLoyalty/components/Toolbar'
  import NavigationDrawersRight from '@/views/createLoyalty/components/NavigationDrawersRight'
  import createLoyaltyMain from '@/views/createLoyalty/components/mainPage'
  // import SwitchControl from './components/mainPage/switchControl/index'
  export default {
    name: 'createLoyalty',
    components: {
      // SwitchControl,
      Toolbar,
      createLoyaltyMain,
      NavigationDrawersRight,
    },
    data () {
      return {}
    },
  }
</script>

<style scoped>
  .main-wrap {
    max-width: 676px;
    width: 100%;
    margin: 0 auto;
  }
</style>
