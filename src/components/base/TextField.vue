
<template>

  <v-text-field
    :id="id"
    v-model="internalValue"
    :append-icon="appendIcon"
    :append-outer-icon="appendOuterIcon"
    :autofocus="autofocus"
    :background-color="backgroundColor"
    :clear-icon="clearIcon"
    :clearable="clearable"
    :color="color"
    :counter="counter"
    :dark="dark"
    :dense="dense"
    :disabled="disabled"
    :error="error"
    :error-count="errorCount"
    :error-messages="errorMessages"
    :filled="filled"
    :flat="flat"
    :full-width="fullWidth"
    :height="height"
    :hide-details="hideDetails"
    :hint="hint"
    :label="label"
    :light="light"
    :loader-height="loaderHeight"
    :loading="loading"
    :messages="messages"
    :outlined="outlined"
    :persistent-hint="persistentHint"
    :placeholder="placeholder"
    :prefix="prefix"
    :prepend-icon="prependIcon"
    :readonly="readonly"
    :reverse="false"
    :rounded="false"
    :rules="rules"
    :shaped="shaped"
    :single-line="singleLine"
    :solo="false"
    :solo-inverted="false"
    :success="success"
    :success-messages="successMessages"
    :suffix="suffix"
    :type="type"
    :validate-on-blur="validateOnBlur"
    :class="getClass"
    :maxlength="maxlength"
  >
    <template v-slot:prepend-inner>
      <v-icon
        v-if="prependInnerIcon"
        :color="prependInnerIconColor"
      >
        {{ prependInnerIcon }}
      </v-icon>
      <slot
        v-else
        name="prepend-inner"
      />
    </template>
  </v-text-field>
</template>

<script>
// https://vuetifyjs.com/en/components/text-fields/#text-fields
/**
 * todo  counter + clearable
 */

  export default {
    name: 'Textfield',
    model: {
      prop: 'value',
      event: 'input',
    },
    props: {
      maxlength: [String, Number],
      value: {
        type: [String, Number],
        default: null,
      },

      appendIcon: String,
      appendOuterIcon: String,
      autofocus: Boolean,
      backgroundColor: String,
      clearIcon: String,
      clearable: Boolean,
      color: String,
      counter: [Boolean, String, Number],
      counterValue: Function, // ---
      dark: Boolean,
      dense: Boolean,
      disabled: Boolean,
      error: Boolean,
      errorCount: [Number, String],
      errorMessages: [String, Array],
      filled: Boolean,
      flat: Boolean,
      fullWidth: Boolean,
      height: [Number, String],
      hideDetails: Boolean,
      hint: String,
      id: String,
      label: String,
      light: Boolean,
      loaderHeight: [Number, String],
      loading: [Boolean, String],
      messages: [String, Array],
      outlined: {
        type: Boolean,
        default: true,
      },
      persistentHint: Boolean,
      placeholder: String,
      prefix: String,
      prependIcon: String,
      prependInnerIcon: String,
      prependInnerIconColor: {
        type: String,
        default: 'neutral-500',
      },
      readonly: Boolean,
      rules: Array,
      shaped: Boolean,
      singleLine: Boolean,
      success: Boolean,
      successMessages: [Array, String],
      suffix: String,
      type: String,
      validateOnBlur: Boolean,

      // New
      minlength: {
        type: [String, Number],
        default: 0,
      },
    },
    computed: {
      internalValue: {
        get () {
          return this.value
        },
        set (val) {
          if (val === this.value) return
          this.$emit('input', val)
        },
      },
      isRequiredText () {
        return !!this.minlength && !this.isFilledText
      },
      isFilledText () {
        return !!this.value && this.value.length >= this.minlength
      },
      isSuccessText () {
        return !!this.minlength && this.isFilledText
      },
      getClass () {
        return {
          'v-input--counter': !!this.counter,
          'v-input--counter-success-text': this.isSuccessText,
          'v-input--counter-error-text': this.isRequiredText,
        }
      },

    },
    watch: {
      value (v) {
        // console.log('v.l', this.value.length, this.minlength)
      },
    },
    mounted () {
      // console.log('getClass', this.getClass)
    },
  }
</script>
