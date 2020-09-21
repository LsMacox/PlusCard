<template>
  <round-frame
    class="w-share-purchase"
    title="Общая доля покупок"
    :all-count="allCount"
    :current-count="currentCount"
    :percentage-difference="32"
  />
</template>

<script>
  import RoundFrame from '@/views/widgets/frames/RoundFrame'

  export default {
    components: { RoundFrame },
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
    computed: {},
    mounted () {},
  }
</script>
