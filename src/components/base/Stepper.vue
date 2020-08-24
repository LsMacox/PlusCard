<template>
  <v-container>
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
        <div class="stepper">
          <div
            v-for="(item, index) in items"
            :key="index"
          >
            <div
              class="stepper-block first-step body-l-semibold"
              :style="'color: ' + getCurrentColor(index)"
            >
              {{ item.title }}
            </div>
            <v-icon
              v-if="index+1<items.length"
              class="stepper__icon"
            >
              mdi-chevron-right
            </v-icon>
          </div>
        </div>
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
  </v-container>
</template>

<script>
  export default {
    name: 'Stepper',

    props: {
      items: {
        type: Array,
        default: () => [],
      },
      value: {
        type: Number,
        default: 0,
      },
    },

    computed: {},
    methods: {
      onBackClick () {
        if (this.value > 0) {
          this.value--
        } else {
          console.log('close')
          this.$emit('close')
        }
      },
      getStepStatus (step) {
        if (step === this.value) {
          return 'active'
        } else if (step < this.value) {
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
