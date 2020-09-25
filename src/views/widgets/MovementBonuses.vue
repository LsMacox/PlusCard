<template>
  <tripple-filled-diagram-frame
    class="w-movement-bonuses"
    :diagram-data="[
      [10, 40, 50, 90, 60, 70, 20],
      [0, 20, 45, 56, 40, 38, 47],
      [0, 10, 25, 36, 20, 18, 7],
    ]"
    :diagram-lables="[
      '09.09',
      '10.09',
      '11.09',
      '12.09',
      '13.09',
      '14.09',
      '15.09',
    ]"
    :diagram-height="168"
    title="Движение бонусов"
    :sub-titles="[
      'Начислено от суммы покупок',
      'Списано от суммы покупок',
      'Сгорело от суммы покупок',
    ]"
    :counts="['195 300', '92 480', '17 900']"
    :all-percentage-differences="[4.32, 2.77, 0.42]"
    :percentage-differences="[1.2, 2.77, -18]"
  />
</template>

<script>
  import TrippleFilledDiagramFrame from '@/views/widgets/frames/TrippleFilledDiagramFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { TrippleFilledDiagramFrame },
    mixins: [WidgetFunctions],
    props: {
    //   widgetData: {
    //     type: Array,
    //     default () {
    //       return [5].fill({
    //         all_count: 0,
    //         clients_count: 0,
    //         clients_increment: 0,
    //         date_end: '2020-09-08',
    //         date_start: '2020-09-08',
    //       })
    //     },
    //   },
    },
    data () {
      return {}
    },
    computed: {},
    mounted () {
    },
    methods: {},
  }
</script>
