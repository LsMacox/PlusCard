<template>
  <table-frame
    title="Сегменты клиентов"
    :sub-titles="['Сегмент', 'Доход', 'Средний чек', 'Клиент стоит']"
    :data="[
      [{text: 'Все клиенты', background: '#F2F2F7', color: '#B5B5C4'}, '26 328 398 ₽', '8 345 ₽', '314 ₽'],
      [{text: 'Потенциально лояльные', background: 'rgba(0, 196, 209, 0.15)', color: '#00C4D1'}, '26 328 398 ₽', '8 345 ₽', '314 ₽'],
      [{text: 'Лояльные', background: 'rgba(0, 209, 93, 0.15)', color: '#00D15D'}, '26 328 398 ₽', '8 345 ₽', '314 ₽'],
      [{text: 'Риск потери', background: 'rgba(255, 163, 56, 0.15)', color: '#FFA338'}, '26 328 398 ₽', '8 345 ₽', '314 ₽'],
      [{text: 'Новые', background: '#EBF1FF', color: '#4776E6'}, '26 328 398 ₽', '8 345 ₽', '314 ₽'],
      [{text: 'До 50 бонусов на счету', background: 'rgba(226, 74, 175, 0.15)', color: '#E24AAF'}, '26 328 398 ₽', '8 345 ₽', '314 ₽'],
      [{text: 'Потеренные', background: 'rgba(234, 76, 42, 0.15)', color: '#EA4C2A'}, '26 328 398 ₽', '8 345 ₽', '314 ₽']
    ]"
  />
</template>

<script>
  import TableFrame from '@/views/widgets/frames/TableFrame'

  export default {
    components: { TableFrame },
    props: {
      // widgetData: {
      //   type: Array,
      //   default () {
      //     return []
      //   },
      // },
    },
    data () {
      return {}
    },
    computed: {
    },
    mounted () {
    },
  }
</script>
