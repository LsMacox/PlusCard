<template>
  <div
    class="widget-box"
  >
    <div class="widget-box-header">
      <div class="widget-box-header-left">
        <span>{{ loadingData ? currentClientsCount : 0 }}</span> клиентов
      </div>
      <div class="app__spacer" />
      <div class="widget-box-header-right">
        <span :class="percent >= 0 ? 'growth' : 'decline'">{{ percent }}%</span>
      </div>
    </div>
    <div
      ref="widget-box-body"
      class="widget-box-body"
    >
      <v-progress-circular
        v-show="!_isMounted"
        indeterminate
        color="primary"
        class="widget-box-body__progress"
      />
      <diagram-line
        v-if="_isMounted"
        :data="diagramData"
        :width="widgetBodyWidth"
        :height="90"
        class="widget-box-body__diagram"
        @percent-calc="setDiagramPercent"
      />
    </div>
  </div>
</template>

<script>
  import DiagramLine from './components/DiagramLine'

  export default {
    components: { DiagramLine },
    props: {
    },
    data () {
      return {
        widgetBodyWidth: null,
        percent: 0,
      }
    },
    computed: {
      loadingData () {
        return this.$store.getters['widget/bonusClients/loading']
      },
      widgetRequest () {
        this.fetchData()
        return {
          start_period: this.period.start,
          filter: this.filter,
          program_id: this.program.id,
          end_period: this.period.end,
        }
      },
      filter () {
        return this.$store.getters['widget/filter/filter'] ?? this.$store.getters['widget/filter/filterDefault']
      },
      program () {
        return this.$store.getters['company/program/program']
      },
      period () {
        return this.$store.getters['widget/filter/period']
      },
      widgetData () {
        return this.$store.getters['widget/bonusClients/widgetData']
      },
      diagramData () {
        var newArr = []

        this.widgetData.forEach(function (data, key) {
          newArr.push(data.clients_count)
        })

        return newArr
      },
      currentClientsCount () {
        return this.$store.getters['widget/bonusClients/currentAllCount']
      },
    },
    created () {
      this.fetchData()
    },
    mounted () {
      this.setWidgetBodyWidth()
    },
    methods: {
      fetchData () {
        this.$store.dispatch('widget/bonusClients/widget', this.widgetRequest)
      },
      setWidgetBodyWidth () {
        this.widgetBodyWidth = this.$refs['widget-box-body'].clientWidth
      },
      setDiagramPercent (data) {
        this.percent = data
      },
    },
  }
</script>

<style lang="scss" scoped>

@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.widget-box {
  padding: 20px;
  border: 1px solid $neutral-250;
  box-sizing: border-box;
  border-radius: 12px;

  .widget-box-header {
      display: flex;
      align-items: center;

      .widget-box-header-left {
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        letter-spacing: 0.1px;
        color: $neutral-900;
        span {
          color: $primary-base;
        }
      }
      .widget-box-header-right {
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        letter-spacing: 0.1px;
        color: $success-500;
        span.growth {
          color: $success-500;
        }
        span.decline {
          color: $error-500;
        }
      }
    }
    .widget-box-body {
        display: flex;
        justify-content: center;
        .widget-box-body__diagram {
          margin-top: 12px;
        }
        .widget-box-body__progress {
          margin-top: 35px;
          margin-bottom: 12px;
        }
      }
  }
</style>
