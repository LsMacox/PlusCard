<template>
  <div class="date-text-field">
    <v-text-field
      v-mask="'##-##-####'"
      v-bind="$attrs"
      maxlength="10"
      v-on="inputListeners"
      @click="showDatePicker = true"
    >
      />
      <date-range-picker
        v-if="showDatePicker"
        class="date-range-picker"
        opens="inline"
        :ranges="false"
        :auto-apply="false"
        :show-dropdowns="true"
        :linked-calendars="false"
        :single-date-picker="true"
        :locale-data="{
          firstDay: 1,
          applyLabel: 'Применить',
          cancelLabel: 'Отменить',
          monthNames: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
          ],
          daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        }"
        @update="updateDateRange"
      />
    </v-text-field>
  </div>
</template>

<script>
  import DateRangePicker from 'vue2-daterange-picker'
  import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

  export default {
    name: 'DateTextField',
    components: {
      DateRangePicker,
    },
    inheritAttrs: false,
    data () {
      return {
        dateText: '',
        showDatePicker: false,
        dateRange: {
          date: new Date(Date.now()).toISOString().split('T')[0],
        },
      }
    },
    computed: {
      inputListeners () {
        var _this = this
        return Object.assign({},
                             this.$listeners,
                             {
                               input: function (event) {
                                 _this.$emit('input', event)
                               },
                             },
        )
      },
    },
    methods: {
      updateDateRange (v) {
        this.showDatePicker = false
        this.dateText = v.startDate.toISOString().split('T')[0]
        console.log(this.dateText)
      },
    },
  }
</script>

<style lang="scss" scoped>
.date-text-field {
    position: relative;
    .date-range-picker {
        position: absolute;
        right: 0;
        z-index: 999;
    }
}
</style>
