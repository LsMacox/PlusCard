<template>
  <cert-widget-template
      :class-name="widgetClasses"
  >
    <template v-slot:header-left>
      <p class="body-m-semibold">
        {{ title }}
      </p>
    </template>

    <template v-slot:body>
<!--      <div-->
<!--        :class="generateClassesByPrefix(widgetClasses, '__box')"-->
<!--        class="d-flex flex-column"-->
<!--      >-->
<!--        <div-->
<!--          v-for="(percent, i) in percentageDifferences"-->
<!--          :key="i"-->
<!--          :class="generateClassesByPrefix(widgetClasses, '__box-container')"-->
<!--          class="d-flex"-->
<!--        >-->
<!--          <div :class="generateClassesByPrefix(widgetClasses, '__box-info')">-->
<!--            <div :class="generateClassesByPrefix(widgetClasses, '__info-title')">-->
<!--              <p class="body-s-semibold">-->
<!--                {{ subTitles[i] }}-->
<!--              </p>-->
<!--            </div>-->
<!--            <div-->
<!--              :class="generateClassesByPrefix(widgetClasses, '__info-statistics')"-->
<!--            >-->
<!--              <span-->
<!--                class="statistics__percent title-m-bold"-->
<!--              >{{ percent }}%</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div-->
<!--        :class="generateClassesByPrefix(widgetClasses, '__diagram')"-->
<!--      >-->
<!--        <div :class="generateClassesByPrefix(widgetClasses, '__diagram-progress')">-->
<!--          <div-->
<!--              v-for="(subTitle, i) in subTitles"-->
<!--              :key="i"-->
<!--              class="v-progress-linear-wrapper"-->
<!--          >-->
<!--            <v-progress-linear-->
<!--              v-if="i > 0"-->
<!--              :rounded="true"-->
<!--              :value="(percentageDifferences[i] / percentageDifferences[0]) * 100"-->
<!--              :color="colors[i]"-->
<!--            />-->
<!--            <v-progress-linear-->
<!--                v-else-->
<!--                :rounded="true"-->
<!--                :value="100"-->
<!--                :color="colors[i]"-->
<!--            />-->
<!--            <div class="v-progress-linear-info">-->
<!--              <div class="body-s-semibold">-->
<!--                {{ percentageDifferences[i] }}-->
<!--              </div>-->
<!--              <div class="body-s-semibold wc-neutral">-->
<!--                {{ subTitle }}-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

        <div
            class="row"
            style="margin-top: 12px;"
        >

            <div
                v-for="(subTitle, i) in subTitles"
                :key="i"
                class="col-2 v-progress-linear-wrapper"
            >
              <div class="row">
                <div class="col-1">
                  <v-progress-linear
                      v-if="i > 0"
                      :rounded="true"
                      :value="(percentageDifferences[i] / percentageDifferences[0]) * 100"
                      :color="colors[i]"
                      height="12"
                      style="transform: rotate(-90deg)"
                  />
                  <v-progress-linear
                      v-else
                      :rounded="true"
                      :value="100"
                      :color="colors[i]"
                      height="12"
                      style="transform: rotate(-90deg)"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="v-progress-linear-info">
                    <div class="body-s-semibold">
                      {{ percentageDifferences[i] }}
                    </div>
                    <div class="body-s-semibold wc-neutral">
                      {{ subTitle }}
                    </div>
                  </div>
                </div>
              </div>

            </div>

        </div>

    </template>
  </cert-widget-template>
</template>

<script>
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'
  import CertWidgetTemplate from '@/views/widgets/components/CertWidgetTemplate'

  export default {
    name: 'DoubleDiagramFrame',
    components: {
      CertWidgetTemplate,
    },
    mixins: [WidgetFunctions],
    inheritAttrs: false,
    props: {
      title: {
        type: String,
        default: '',
      },
      subTitles: {
        type: Array,
        default () {
          return ['title', 'title', 'title']
        },
      },
      percentageDifferences: {
        type: Array,
        default () {
          return [0, 0, 0, 0, 0]
        },
      },
      textHelp: {
        type: String,
        default: null,
      },
      colors: {
        type: Array,
        default () {
          return ['primary', 'primary', 'primary', 'primary', 'primary']
        },
      },
    },
    data () {
      return {
        dialogHelp: false,
        transitionDuration: 100,
        percent1: 0,
        percent2: 0,
        percent3: 0,
      }
    },
    computed: {
      widgetClasses () {
        return this.parentClass !== undefined ? this.parentClass + ' f-vertical-progress' : 'f-vertical-progress'
      },
    },
    watch: {
      percentageDifferences: {
        handler: function (v) {
          this.clearHandlers()
          for (let i = 0; i < v.length; i++) {
            const n = Number(v[i])
            if (Number.isNaN(n) || n === 0) {
              return
            }
            this.countNumber(v[i], i + 1)
          }
        },
        immediate: true,
      },
    },
    mounted () {},
    methods: {
      countNumber (number, ind) {
        let counter = 0
        const innerNum = parseInt(
          this.findClosestNumber(this.transitionDuration / 10, number),
        )
        const interval = this.transitionDuration / innerNum
        const handlerName = `percent${ind}Interval`

        this[handlerName] = setInterval(() => {
          if (counter === innerNum) {
            // back to origin precision
            this[`percent${ind - 1}`] = number
            window.clearInterval(this[handlerName])
          }
          counter++
        }, interval)
      },
      findClosestNumber (bound, value) {
        if (value <= bound) {
          return value
        }
        return this.findClosestNumber(bound, value / 10)
      },
      clearHandlers () {
        if (this.percent1Interval) {
          clearTimeout(this.percent1Interval)
        }
        if (this.percent2Interval) {
          clearInterval(this.percent2Interval)
        }
        if (this.percent3Interval) {
          clearInterval(this.percent3Interval)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>

@import "./src/styles/vuetify-preset-plus/light_theme/variables";

.f-vertical-progress {
  .f-vertical-progress__body {
    margin-top: 32px!important;
    justify-content: space-between!important;
    .f-vertical-progress__box {
      .f-vertical-progress__box-container {
        margin-top: 10px;

        &:nth-child(1) {
          margin-top: 14.5px;
          .f-vertical-progress__info-statistics  {
            .statistics__percent {
              color: $primary-base
            }
          }
        }

        &:nth-child(2) {
          .f-vertical-progress__info-statistics  {
            .statistics__percent {
              color: $warning-500
            }
          }
        }

        &:nth-child(3) {
          .f-vertical-progress__info-statistics  {
            .statistics__percent {
              color: $chart-500
            }
          }
        }

        .f-vertical-progress__box-info {
          .f-vertical-progress__info-title {
            margin-bottom: 5px;
            p {
              margin-bottom: 0;
              color: $neutral-500;
            }
          }
        }

        .f-vertical-progress__info-statistics {
          .statistics__number {
            float: left;
            margin-right: 8px;
            width: 100px;
          }
          .statistics__percent-all {
            float: left;
            margin-right: 18px;
          }
          .statistics__percent {
            margin-top: 5px;
            display: inline-block;
          }
        }
      }
    }
    .f-vertical-progress__diagram {
      margin-top: auto;
      transform: rotate(-90deg) translateX(12px) translateY(44px);
      .f-vertical-progress__diagram-progress {
        .v-progress-linear {
          height: 12px!important;
          width: 47px;
          margin-bottom: 12px!important;
          margin-left: 88px;
        }
        .v-progress-linear-wrapper {
          padding-bottom: 35px;
        }
      }
    }
    .v-progress-linear-info {
      margin-top: 4px;
      margin-left: 20px;
    }

    .v-progress-linear {
      width: 47px!important;
    }
  }
}

@media (min-width: 960px) {
  .f-vertical-progress__diagram {
    .f-vertical-progress__diagram-progress {
      .v-progress-linear-wrapper {
        padding-bottom: 35px!important;
      }
    }
  }
}

.w-payment__diagram-progress {
  height: 166px;
}
.widget-box {
  height: 166px!important;
}

.widget-box .widget-box__body {
  justify-content: space-between!important;
}

.col-2 {
  flex: 0 0 19.666667%;
  max-width: 19.666667%;
}
</style>
