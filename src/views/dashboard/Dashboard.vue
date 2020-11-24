<template>
  <div class="crm b-segment">
    <toolbar />
    <widget-line />
  </div>
</template>

<script>
  import Toolbar from '@/views/dashboard/Toolbar'
  import WidgetLine from '@/views/dashboard/widget/index'

  export default {
    components: {
      Toolbar,
      WidgetLine,
    },
    data () {
      return {}
    },
    computed: {},
    methods: {},
  }
</script>
