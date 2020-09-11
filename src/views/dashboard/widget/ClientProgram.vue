<template>
  <div
    class="widget-box w-client-program"
  >
    <div class="widget-box-header w-client-program__header">
      <div class="widget-box-header-left w-client-program__header-left">
        <p class="body-m-semibold">
          Клиенты программы
        </p>
      </div>
      <div class="widget-box-header-right w-client-program__header-right">
        <iconify-icon
          class="question__icon"
          icon="question-circle-outlined"
          height="15"
        />
      </div>
    </div>
    <div
      ref="widget-box-body"
      class="widget-box-body w-client-program__body"
    >
      <v-container class="grey lighten-5">
        <v-row
          no-gutters
          class="w-client-program__new"
        >
          <v-col>
            <div class="w-client-program__new-title">
              <p>Новые</p>
            </div>
            <div class="w-client-program__new-statistics">
              <p class="new-statistics__number">
                124
              </p>
              <span class="new-statistics__percent">-44%</span>
            </div>
          </v-col>
          <v-col>
            <diagram-line
              class="widget-box-body__diagram w-client-program__diagram"
              :height="200"
            />
          </v-col>
        </v-row>
        <v-row
          no-gutters
          class="w-client-program__all"
        >
          <v-col>
            <div class="w-client-program__all-title">
              <p>Всего</p>
            </div>
            <div class="w-client-program__all-statistics">
              <p class="all-statistics__number">
                7 908
              </p>
              <span class="all-statistics__percent">+32%</span>
            </div>
          </v-col>
          <v-col>
            <diagram-line
              class="widget-box-body__diagram w-client-program__diagram"
              :height="200"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
  import DiagramLine from '@/views/loyalty/report/widget/components/DiagramLine.vue'
  export default {
    components: { DiagramLine },
    mounted () {},
  }
</script>

<style lang="scss" scoped>

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_client-program.scss";

</style>
