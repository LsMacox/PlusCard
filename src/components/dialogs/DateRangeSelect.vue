<template>
  <div class="app__date-select">
    <div class="app__date-select-btn">
      <div
        class="app__date-select-btn-text"
        @click="show = !show"
      >
        {{ getItemLabel(model) }}
      </div>
      <div>
        <span
          v-if="!show"
          class="iconify app__date-select-btn-icon"
          data-icon="feather:chevron-down"
          data-inline="false"
        />
        <span
          v-else
          class="iconify app__date-select-btn-icon"
          data-icon="octicon:chevron-up-16"
          data-inline="false"
        />
      </div>
    </div>
    <div
      v-show="show"
      class="app__date-select-block"
      :style="`min-width: ${minWidth};`"
    >
      <div class="app__date-select-block-square" />
      <div
        v-for="(item, i) in items"
        :key="i"
        class="app__date-select-block-item"
        :style="getStyle(item)"
        @click="selectItem(item)"
      >
        <div class="app__date-select-block-item-text">
          {{ item.name }}
        </div>
        <div
          v-if="isActiveItem(item)"
          style="position: relative;"
        >
          <span
            class="iconify app__date-select-block-item-icon"
            data-icon="bx:bx-check"
            data-inline="false"
          />
        </div>
      </div>
      <!--выбор календарь-->
      <date-range-picker
        ref="picker"
        v-model="dateRange"
        opens="right"
        :ranges="false"
        :auto-apply="false"
        :locale-data="{
          firstDay: 0,
          applyLabel: 'Применить',
          cancelLabel: 'Отменить',
          monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          daysOfWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        }"
      >
        <div
          slot="input"
          class="app__date-select-block-item"
          style="display: none;"
        >
          <div class="app__date-select-block-item-text">
            собственный диапазон
          </div>
          <div
            v-if="isActiveItem({ id: 7, name: 'собственный диапазон', start: null, end: null })"
            style="position: relative;"
          >
            <span
              class="iconify app__date-select-block-item-icon"
              data-icon="bx:bx-check"
              data-inline="false"
            />
          </div>
        </div>

        <div
          slot="footer"
          slot-scope="data"
        >
          <div class="footer-content">
            <div class="range">
              {{ formatRange(data.rangeText) }}
            </div>
            <div class="actions">
              <v-btn
                color="primary"
                small
                @click="data.clickCancel()"
              >
                Отменить
              </v-btn>
              <v-btn
                small
                color="primary"
                @click="data.clickApply"
              >
                <span
                  class="iconify"
                  data-icon="carbon:checkmark-outline"
                  data-inline="false"
                />
                Применить
              </v-btn>
            </div>
          </div>
        </div>
      </date-range-picker>
    </div>
  </div>
</template>

<script>
  import DateRangePicker from 'vue2-daterange-picker'
  import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

  export default {
    components: {
      DateRangePicker,
    },
    props: [
      'minWidth',
      'items',
      'model',
      'itemValue',
      'itemLabel',
    ],
    data () {
      return {
        show: false,
        dateRange: {
          startDate: new Date(Date.now()),
          endDate: new Date(Date.now()),
        },
      }
    },
    methods: {
      getItemLabel (model) {
        if (model) {
          const elem = this.items.find(objItem => objItem[this.itemValue] === model)
          return elem[this.itemLabel]
        }
        if (this.items[0] && this.items[0][this.itemLabel]) return this.items[0][this.itemLabel]
        return 'undefined'
      },
      getStyle (item) {
        if (item[this.itemValue] === this.model) return 'color: #4776E6; font-weight: 600;'
        return 'color: #9191A1; font-weight: normal;'
      },
      isActiveItem (item) {
        if (item[this.itemValue] === this.model) return true
        return false
      },
      selectItem (item) {
        const elem = this.items.find(objItem => objItem[this.itemValue] === item[this.itemValue])
        this.updateItem(elem[this.itemValue])
        this.show = !this.show
      },
      updateItem (v) {
        this.$emit('update:model', v)
      },
      formatRange (range) {
        const start = range.split(' - ')[0]
        const end = range.split(' - ')[1]
        if (start !== undefined && start !== null && end !== undefined && end !== null) {
          return this.$moment(start).format('ll') + ' - ' + this.$moment(end).format('ll')
        }
        return ' - '
      },
    },
  }
</script>

<style lang="scss" scoped>
.app__date-select {
  position: relative;

  .app__date-select-btn {
    display: flex;
    align-items: center;

    .app__date-select-btn-text {
      font-weight: 600;
      font-size: 17px;
      line-height: 22px;
      letter-spacing: 0.4px;
      color: #4776E6;
    }

    .app__date-select-btn-icon {
      position: relative;
      top: 4px;
      font-size: 24px;
      color: #4776E6;
    }
  }

  .app__date-select-block {
    position: absolute;
    top: 40px;
    left: -20px;
    padding: 8px 18px 8px 20px;
    background: #FFFFFF;
    box-shadow: 0px 5px 20px rgba(88, 93, 106, 0.1);
    border-radius: 12px;
    z-index: 1000;

    .app__date-select-block-square {
      position: absolute;
      top: -6px;
      left: 57px;
      width: 12px;
      height: 12px;
      background: #FFFFFF;
      border-radius: 1px;
      transform: rotate(-45deg);
      z-index: 999;
    }

    .app__date-select-block-item {
      display: flex;
      align-items: center;
      margin: 12px 0;
      font-style: normal;
      font-size: 15px;
      line-height: 21px;
      cursor: pointer;

      .app__date-select-block-item-text {
        width: calc(100% - 22px);
      }

      .app__date-select-block-item-icon {
        position: absolute;
        top: -16px;
        left: 0;
        font-size: 26px;
      }

      .app__date-select-block-item-icon-white {
        font-size: 22px;
        color: #ffffff;
      }
    }
  }
}

.form-control.reportrange-text {
  padding: 0;
  border: none;
  height: 0 !important;
}
</style>
