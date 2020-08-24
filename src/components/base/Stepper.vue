<template>
  <v-row
    align="center"
    style="min-height: 100px"
  >
    <v-col cols="3">
      <v-btn
        color="secondary"
        :text="true"
        :ripple="false"
        @click="onBackClick"
      >
        <v-icon>mdi-arrow-left</v-icon>Назад
      </v-btn>
    </v-col>
    <v-col cols="9">
      <v-row class="stepper">
        <template v-for="(item, index) in items">
          <div
            :key="'div' +index"
            class="stepper-block first-step body-l-semibold"
            :style="'color: ' + getCurrentColor(index)"
          >
            {{ item.title }}
          </div>
          <v-icon
            v-if="index+1<items.length"
            :key="'icon'+index"
            class="stepper__icon"
          >
            mdi-chevron-right
          </v-icon>
        </template>
      </v-row>
    </v-col>
  </v-row>
  <!-- <v-stepper v-model="value">
      <v-stepper-header>
        <v-stepper-step
          v-for="(item, index) in items"
          :key="index"
          :complete="value>index"
          :step="index"
        >
          {{ item.title }}
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>-->
</template>

<script>
  export default {
    name: 'Stepper',
    model: {
      prop: 'value',
      event: 'change',
    },

    props: {
      items: {
        type: Array,
        default: () => [],
      },
      value: {
        type: Number,
        default: 0,
        required: true,
      },
    },
    computed: {
      internalValue: {
        get () {
          return this.value
        },
        set (val) {
          if (val === this.value) return

          console.log('set, ', val)
          // this.value = val

          this.$emit('change', val)
        },
      },
    },
    methods: {
      onBackClick () {
        if (this.internalValue > 0) {
          this.$nextTick(() => (this.internalValue = this.internalValue - 1))
          // this.internalValue--
        } else {
          console.log('close')
          this.$emit('close')
        }
      },
      getStepStatus (step) {
        if (step === this.internalValue) {
          return 'active'
        } else if (step < this.internalValue) {
          return 'complite'
        } else {
          return ''
        }
      },
      getCurrentColor (step) {
        const status = this.getStepStatus(step)
        switch (status) {
          case 'active':
            return '#4776E6'
          case 'complite':
            return '#2A2A34'
          default:
            return '#D7D7E0'
        }
      },
    },
  }
</script>
