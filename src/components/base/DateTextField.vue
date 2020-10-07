<template>
  <div class="date-text-field">
    <div class="date-text-field__input">
      <v-text-field
        ref="text-field"
        v-model="dateText"
        v-mask="'##.##.####'"
        v-bind="$attrs"
        maxlength="10"
        autocomplete="off"
        @focus="showDatePicker = true"
      />
      <iconify-icon
        class="icon-feather-calendar"
        icon="feather-calendar"
        width="21"
      />
    </div>
    <date-range-picker
      v-if="showDatePicker"
      ref="picker"
      v-model="dateRange"
      class="date-range-picker"
      opens="inline"
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
        </div>
      </div>
    </date-range-picker>
  </div>
</template>

<script>
  import { mask } from 'vue-the-mask'
  import DateRangePicker from 'vue2-daterange-picker'
  import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

  export default {
    name: 'DateTextField',
    directives: { mask },
    components: {
      DateRangePicker,
    },
    inheritAttrs: false,
    data () {
      return {
        dateText: '',
        showDatePicker: false,
        dateRange: {
          startDate: new Date(Date.now()).toISOString().split('T')[0],
        },
      }
    },
    computed: {
    },
    created () {
      this.clickEventListener()
    },
    methods: {
      updateDatePicker (v) {
        this.showDatePicker = false
        this.dateText = v.startDate.toISOString().split('T')[0]
        this.dateText = this.$moment(this.dateText).format('DD.MM.YYYY')
        this.$emit('update:date', this.dateText)
      },
      clickEventListener () {
        document.addEventListener('click', (event) => {
          let isClose = true
          event.path.forEach((dom) => {
            if (typeof dom.className !== 'undefined') {
              if (dom.className.indexOf('date-text-field') > -1) isClose = false
            }
          })
          if (isClose) this.showDatePicker = false
        })
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
        z-index: 999;
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
    }
    .daterangepicker .calendars .calendars-container .drp-calendar:first-child {
      border-right: none !important;
    }
}

.date-text-field__input {
  position: relative;

  .icon-feather-calendar {
    position: absolute;
    top: 25%;
    right: 12px;
    color: $neutral-500;
  }
}
</style>
