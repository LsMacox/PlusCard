<template>
  <div class="widget-box">
    <div
      class="widget-box-header"
      @click="toggleSidePanel"
    >
      <div class="widget-box-header-left">
        Операторы
      </div>
      <div class="app__spacer" />
      <div class="widget-box-header-right">
        <span
          class="iconify"
          data-icon="entypo:chevron-right"
          data-inline="false"
        />
      </div>
    </div>
    <div class="widget-box-body">
      <ul
        class="operators__list"
      >
        <li
          v-for="operator in someOperators"
          :key="operator.id"
          class="operator__item"
        >
          <div class="operator__item-top">
            <p class="operator-name">
              {{ operator.label }}
            </p>
            <span class="operator-percent">10%</span>
          </div>
          <div class="operator__item-bottom">
            <v-progress-linear
              :value="25"
              style="height: 4px"
              color="primary"
              rounded="rounded"
              class="operator-progress"
            />
          </div>
        </li>
      </ul>
    </div>
    <side-panel
      v-model="sidePanelActive"
      :width="483"
      class="side-panel__operators"
    >
      <div class="operators__header">
        <h1 class="operators__title">
          Операторы
        </h1>
        <p class="operators__sub-title">
          96 операций за сегодня
        </p>
      </div>
      <div class="operators__body">
        <ul
          class="operators__list"
        >
          <li
            v-for="operator in operators"
            :key="operator.id"
            class="operator__item"
          >
            <div class="operator__item-top">
              <p class="operator-name">
                {{ operator.label }}
              </p>
              <span class="operator-percent">44 операций / 10%</span>
            </div>
            <div class="operator__item-bottom">
              <v-progress-linear
                :value="25"
                style="height: 4px"
                color="primary"
                rounded="rounded"
                class="operator-progress"
              />
            </div>
          </li>
        </ul>
      </div>
    </side-panel>
  </div>
</template>

<script>
  import SidePanel from '@/components/base/SidePanel.vue'

  export default {
    components: { SidePanel },
    props: {
      widgetdata: {
        type: Array,
        default () {
          return []
        },
      },
      operators: {
        type: Array,
        default () {
          return []
        },
      },
    },
    data () {
      return {
        sidePanelActive: false,
      }
    },
    computed: {
      someOperators () {
        return this.$_.take(this.operators, 3)
      },
    },
    mounted () {},
    methods: {
      toggleSidePanel () {
        this.sidePanelActive = !this.sidePanelActive
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
    cursor: pointer;
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
      // color: #00D15D;
      span {
        color: $neutral-500;
      }
    }
  }
  .operators__list {
    list-style: none;
    padding-left: 0;
    margin-top: 10px;
    .operator__item {
      display: flex;
      flex-direction: column;
      margin-top: 11px;
      .operator__item-top {
        margin-bottom: -2px;
        .operator-name {
          float: left;
          margin-bottom: 0;
          font-style: normal;
          font-weight: 500;
          font-size: 13px;
          color: $neutral-600;
        }
        .operator-percent {
          float: right;
          font-style: 13px;
          font-weight: 600;
          color: $primary-base;
        }
      }
    }
  }
  .side-panel__operators {
    .operators__header {
      margin-top: 45px;
      margin-left: 35px;
      .operators__title {
        font-family: Gilroy;
        font-style: normal;
        font-weight: bold;
        font-size: 22px;
        color: $neutral-900;
      }
      .operators__sub-title {
        font-family: Gilroy;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        color: $neutral-700;
        margin-top: 10px;
        margin-bottom: 0;
      }
    }
    .operators__body {
      width: 415px;
      margin-left: 34px;
      margin-right: 34px;
      margin-top: 25px;
      .operators__list {
        .operator__item {
          margin-top: 24px;
          .operator__item-top {
            .operator-name {
              font-size: 15px;
              color: $neutral-900;
            }
            .operator-percent {
              font-weight: 600;
              font-size: 15px;
              color: $neutral-900;
            }
          }
          .operator__item-bottom {
            margin-top: 7px;
          }
        }
      }
    }
  }

}
</style>
