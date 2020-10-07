<template>
  <v-switch
    v-model="internalValue"
    hide-details
    inset
  >
    <template v-slot:label>
      <span
        v-if="label"
        :class="{
          'body-m-medium': true,
          'neutral-900--text': internalValue,
          'neutral-600--text': !internalValue,
        }"
      > {{ label }}</span>
      <slot name="label" />
    </template>
  </v-switch>
</template>

<script>

  // import { selectable } from 'vuetify/lib/mixins/selectable'

  export default {
    name: 'Switch',
    model: {
      prop: 'inputValue',
      event: 'change',
    },
    // mixins: [selectable],
    props: {
      inputValue: {
        type: [String, Boolean, Number],
        default: null,
      },
      falseValue: {
        type: [String, Boolean, Number],
        default: null,
      },
      trueValue: {
        type: [String, Boolean, Number],
        default: null,
      },
      multiple: {
        type: Boolean,
        default: null,
      },
      label: {
        type: String,
        default: undefined,
      },
    },
    data () {
      return {
        internalValue: this.inputValue,
      }
    },

    computed: {

    },
    watch: {
      inputValue (val) {
        this.internalValue = val
      },
      internalValue (v) {
        this.$emit('change', v)
      },
    },
    mounted () {

    },
    created () {

    },
  }
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

</style>
