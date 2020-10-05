<template>
  <div
    class="app__date-select"
  >
    <div
      class="app__date-select-btn"
      @click.stop="show = !show"
    >
      <div class="app__date-select-btn-text">
        {{ getItemLabel(model) }}
      </div>
      <div>
        <v-icon
          v-if="!show"
          style="position: relative; top: 3px;"
        >
          $iconify_feather-chevron-down
        </v-icon>
        <v-icon
          v-else
          style="position: relative; top: 3px;"
        >
          $iconify_feather-chevron-up
        </v-icon>
      </div>
    </div>

    <!--модальный блок-->
    <div
      v-show="show"
      class="app__date-select-block"
      :style="`min-width: ${minWidth};`"
      @click.stop=""
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
          <v-icon>
            $iconify_bx-check
          </v-icon>
        </div>
      </div>

      <!--активатор собственного диапазона-->
      <div
        class="app__date-select-block-item"
        @click="openDatePicker"
      >
        <div
          class="app__date-select-block-item-text"
          :style="getStyle({id: 8})"
        >
          {{ getMyPeriod() }}
        </div>
      </div>
    </div>

    <!--модальный блок datepicker-->
    <div
      v-if="showDatePicker"
      class="app__date-select-block-datepicker"
      :style="`min-width: ${minWidth};`"
      @click.stop=""
    >
      <div class="app__date-select-block-square" />
      <!--выбор календарь-->
      <date-range-picker
        ref="picker"
        v-model="dateRange"
        opens="inline"
        :ranges="false"
        :auto-apply="false"
        :show-dropdowns="true"
        :linked-calendars="false"
        :locale-data="{
          firstDay: 1,
          applyLabel: 'Применить',
          cancelLabel: 'Отменить',
          monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        }"
        @update="updateDateRange"
      >
        <!--        <template-->
        <!--          v-slot:input="picker"-->
        <!--          style="min-width: 350px;"-->
        <!--        >-->
        <!--          {{ picker.startDate }} - {{ picker.endDate }}-->
        <!--        </template>-->

        <template
          @input="picker"
          style="min-width: 350px;"
        >
          <div class="custom" />
        </template>

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
                @click="closeDatePicker"
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
        showDatePicker: false,
        dateRange: {
          startDate: new Date(Date.now()).toISOString().split('T')[0],
          endDate: new Date(Date.now()).toISOString().split('T')[0],
        },
      }
    },
    computed: {
      period () {
        return this.$store.getters['widget/filter/period']
      },
    },
    created () {
      if (this.period) {
        this.dateRange = {
          startDate: this.period.start,
          endDate: this.period.end,
        }
      }

      document.addEventListener('click', () => {
        if (this.show) {
          this.show = !this.show
        }
      })
    },
    methods: {
      getItemLabel (model) {
        if (model) {
          const elem = this.items.find(objItem => objItem[this.itemValue] === model)
          if (elem) return elem[this.itemLabel]
          else if (this.dateRange.startDate && this.dateRange.endDate) {
            return this.$moment(this.dateRange.startDate).format('DD.MM.YYYY') + ' - ' +
              this.$moment(this.dateRange.endDate).format('DD.MM.YYYY')
          }
          return 'undefined'
        }
        if (this.items[0] && this.items[0][this.itemLabel]) return this.items[0][this.itemLabel]
        return 'undefined'
      },
      getMyPeriod () {
        if (this.period && this.period.id === 8) {
          return this.$moment(this.dateRange.startDate).format('DD.MM.YYYY') + ' - ' +
            this.$moment(this.dateRange.endDate).format('DD.MM.YYYY')
        } else {
          return 'собственный диапазон'
        }
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
        this.dateRange = {
          startDate: elem.start,
          endDate: elem.end,
        }
        this.updateItem(elem[this.itemValue])
        this.show = !this.show
      },
      updateItem (v) {
        this.$emit('update:model', v)
      },
      // DATEPICKER
      openDatePicker () {
        this.show = false
        this.showDatePicker = true
      },
      closeDatePicker () {
        this.show = false
        this.showDatePicker = false
      },
      updateDateRange (v) {
        const date = {
          id: 8,
          name: 'собственный диапазон',
          start: this.dateRange.startDate.toISOString().split('T')[0],
          end: this.dateRange.endDate.toISOString().split('T')[0],
        }
        // console.log(date)
        this.show = false
        this.showDatePicker = false
        this.updateItem(date.id)
        this.$store.commit('widget/filter/period', date)
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

  .app__date-select-block-datepicker {
    position: absolute;
    top: 40px;
    left: -20px;
    background: #FFFFFF;
    box-shadow: 0px 5px 20px rgba(88, 93, 106, 0.1);
    border-radius: 12px;
    z-index: 1000;
  }
}
</style>
