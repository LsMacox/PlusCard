<template>
  <circle-widget
    class="w-share-purchase"
    data-title="Общая доля покупок"
    data-sub-title-first="244 покупки по программе"
    data-sub-title-second="344 покупки всего"
    :all-count="allCount"
    :current-count="currentCount"
    :percentage-difference="percentageDifference"
  />
</template>

<script>
  import CircleWidget from '@/views/widgets/frames/CircleWidget'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { CircleWidget },
    mixins: [WidgetFunctions],
    // props: {
    //   widgetData: {
    //     type: Array,
    //     default () {
    //       return [5].fill({
    //         all_count: 0,
    //         clients_count: 0,
    //         client_increment: 0,
    //         date_end: '2020-09-08',
    //         date_start: '2020-09-08',
    //       })
    //     },
    //   },
    // },
    data () {
      return {
        allCount: 200,
        currentCount: 140,
      }
    },
    computed: {
      percentageDifference () {
        return this.relativeChange(this.allCount, this.currentCount)
      },
    },
    mounted () {},
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_share-purchase.scss";

</style>
