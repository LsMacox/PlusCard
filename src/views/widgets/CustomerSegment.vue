<template>
  <table-frame
    title="Сегменты клиентов"
    :sub-titles="['Сегмент', 'Доход', 'Средний чек', 'Клиент стоит']"
    :data="segments"
  />
</template>

<script>
  import TableFrame from '@/views/widgets/frames/TableFrame'

  export default {
    components: { TableFrame },
    props: {},
    data () {
      return {
        widgetData: [],
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      segments () {
        return this.$store.getters['widget/segment/segments']
      },
    },
    watch: {
      program (v) {
        if (v) this.fetchData()
      },
    },
    mounted () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        this.$store.dispatch('widget/segment/segments', { program_id: this.program.id })
        // console.log('SEGM ENTS_')
        // console.log(this.segments)
        // console.log('SEGMENTS_')
      },
    },
  }
</script>
