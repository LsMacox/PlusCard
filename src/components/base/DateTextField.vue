<template>
  <div
    ref="baseTextField"
    v-base-click-outside="hide"
    class="date-text-field"
  >
    <div class="date-text-field__input">
      <base-text-field
        ref="text-field"
        v-model="dateText"
        v-mask="mask"
        v-bind="$attrs"       
        autocomplete="none"
        :autofocus="false"
        :rules="rules"
        @focus="show()"
      >
        <template v-slot:append>
          <v-icon
            color="neutral-500"
          >
            $iconify_feather-calendar
          </v-icon>
        </template>
      </base-text-field>
      <!-- <iconify-icon
        v-if="false"
        class="icon-feather-calendar"
        icon="feather-calendar"
        width="21"
      /> -->
    </div>
    <date-range-picker
      ref="picker"
      v-model="dateRange"
      :class="{show: showDatePicker, 'date-range-picker': true, 'date-range-picker--left': left, }"
      opens="inline"
      :time-picker="timePicker"
      :ranges="false"
      :auto-apply="true"
      :show-dropdowns="true"
      :linked-calendars="false"
      :single-date-picker="true"
      :locale-data="{
        firstDay: 1,
        applyLabel: 'Применить',
        cancelLabel: 'Отменить',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      }"
      @update="updateDatePicker"
    >
      <div
        slot="footer"
        slot-scope="data"
      >
        <div class="footer-content">
          <v-col>
            <div class="actions">
              <v-btn
                class="date-range_picker__btn"
                color="primary"
                small
                @click="showDatePicker = false"
              >
                Отменить
              </v-btn>
              <v-btn
                class="date-range_picker__btn"
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
          </v-col>
        </div>
      </div>
    </date-range-picker>
  </div>
</template>

<script>
  import Calculation from '@/mixins/calculation.js'
  import { mask } from 'vue-the-mask'
  import DateRangePicker from 'vue2-daterange-picker'
  import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
  import { config } from '@/config'

  export default {
    name: 'DateTextField',
    directives: { mask },
    components: {
      DateRangePicker,
    },
    mixins: [Calculation],
    inheritAttrs: false,
    props: {
      date: {
        type: String,
        default: '',
      },
      dateFormat: {
        type: String,
        default: config.date.DATE_FORMAT,
      },
      left: {
        type: Boolean,
        default: false,
      },
      timePicker: {
        type: Boolean,
        default: false,
      },
      rules: {
        type: Array,
        default: undefined,
      },

    },
    data () {
      return {
        dateText: '',
        showDatePicker: false,
        dateRange: {
          startDate: new Date(),
        },
      }
    },
    computed: {
      mask () {
        return this.dateFormat.replace(/[DMYHhms]/g, '#')
      },
    },
    watch: {
      dateText (v) {
<<<<<<< HEAD
        const date = this.$moment(v, this.dateFormat).toString()
=======
        const date = this.$moment(v, this.dateFormat).toISOString()
        console.log('update:date', date)
>>>>>>> 5b0e153e516035d1864efd52f6f985ffb52e08b8
        this.$emit('update:date', date)
      },
    },
    created () {
      if (this.date) {
        this.dateRange.startDate = this.$moment(this.date)
        this.dateText = this.$moment(this.date).format(this.dateFormat)
      }
    },
    methods: {
      updateDatePicker (v) {
        this.showDatePicker = false
        if (this.dateFormat.length) {
          this.dateText = this.$moment(v.startDate).format(this.dateFormat)
        } else {
          this.dateText = v.startDate.toISOString().split('T')[0]
        }
      },
      show () {
        this.$nextTick(() => {
          this.calculationPositionEl(this.$refs.picker.$el, this.$refs.baseTextField)
          this.showDatePicker = true
        })
      },
      hide () {
        this.showDatePicker = false
      },
    },
  }
</script>

<style lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.date-text-field {
    position: relative;
    .date-range-picker {
        position: absolute;
        right: 0;
        z-index: 99;
        margin-bottom: 4px;
        margin-top: 4px;
        display: none !important;
        .footer-content {
          .actions {
            padding: 15px 20px 15px 23px !important;
            button {
              height: 33px;
            }
          }
        }
        .date-range_picker__btn {
          height: 34px;
        }
        &.show {
          display: block !important;
        }

        &.date-range-picker--left{
          left: 0px;
          right: auto;
        }
    }
    .daterangepicker .calendars .calendars-container .drp-calendar:first-child {
      border-right: none !important;
    }
}

.date-text-field__input {
  // position: relative;

  .icon-feather-calendar {
    position: absolute;
    top: 25%;
    right: 12px;
    color: $neutral-500;
  }
}
</style>
