<template>
  <div>
    <vertical-progress-frame
      class="w-bonus-ratio"
      title="Cоотношение бонусов"
      :sub-titles="['Начислено', 'Списано', 'Сгорело']"
      :percentage-differences="[46, 34, 21]"
    />
  </div>
</template>

<script>
  import VerticalProgressFrame from '@/views/widgets/frames/VerticalProgressFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { VerticalProgressFrame },
    mixins: [WidgetFunctions],
    props: {
      widgetData: {
        type: Array,
        default () {
          return [5].fill({
            all_count: 0,
            clients_count: 0,
            clients_increment: 0,
            date_end: '2020-09-08',
            date_start: '2020-09-08',
          })
        },
      },
    },
    data () {
      return {}
    },
    computed: {
      percentageDifference () {
        if (this.widgetData && this.widgetData.length >= 2) {
          if (this.widgetData[1].clients_count > 0) {
            return this.relativeChange(this.widgetData[0].clients_count, this.widgetData[1].clients_count)
          }
        }
        return 0
      },
    },
    mounted () {},
    methods: {},
  }
</script>
