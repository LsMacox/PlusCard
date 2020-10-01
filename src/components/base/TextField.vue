
<template>
  <v-text-field
    :id="id"
    ref="vTextField"
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
    @update:error="updateError"
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
    <template v-slot:append>
      <v-row
        no-gutters
        align="baseline"
      >
        <v-col><slot name="append" /></v-col>
        <v-col>
          <v-counter
            v-if="!!counter"
            :value="computedCounterValue"
            :max="computedMaxCounter"
            :class="{
              'error--text': isRequiredText,
            }"
          />
        </v-col>
        <v-col>
          <base-tooltip
            v-model="showError"
            text="Меню действий сертификата"
            color="error"
            right
          >
            <v-icon
              v-if="hasErrors"
              color="error"
              @click="showError = !showError"
            >
              $iconify_ion-warning
            </v-icon>
            <template v-slot:content>
              <v-messages v-model="errorMessagesToDisplay" />
            </template>
          </base-tooltip>
        </v-col>
      </v-row>
    </template>
  </v-text-field>
</template>

<script>
// https://vuetifyjs.com/en/components/text-fields/#text-fields
/**
 * todo  counter + clearable
 */

  import { VTextField } from 'vuetify/lib'
  import { VInput } from 'vuetify/lib'
  import Validatable from 'vuetify/lib/mixins/validatable'

  export default {
    name: 'Textfield',
    mixins: [VTextField, VInput, Validatable],
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
      hideDetails: {
        type: Boolean,
        default: true,
      },
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
    data () {
      return {
        showError: false,
        // computedCounterValue: 0,
      }
    },
    computed: {
      hasErrors () {
        return this.errorMessagesToDisplay.length > 0
      },
      // computedCounterValue () {
      //   return this.$refs.vTextField ? this.$refs.vTextField.computedCounterValue : 0
      // },
      computedMaxCounter () {
        return this.counter === true ? this.maxlength : this.counter
      },
      errorMessagesToDisplay () {
        console.log('this.validations', this.validations)
        
        return this.validations.map(validation => {
          if (typeof validation === 'string') return validation
          const validationResult = validation(this.internalValue)
          return typeof validationResult === 'string' ? validationResult : ''
        }).filter(message => message !== '')
      },      
      isRequiredText () {
        return !!this.minlength && !this.isFilledText
      },
      isMaxText () {
        return !!this.maxlength && !!this.value && this.value.length > this.maxlength
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
          'v-input--counter-error-text': this.isRequiredText || this.isMaxText,
        }
      },

    },
    watch: {
      value (v) {
        // console.log('v.l', this.value.length, this.minlength)
      },
    },
    mounted () {
      console.log('this.$refs.vTextField', this.$refs.vTextField)
      // this.computedCounterValue = this.$refs.vTextField.computedCounterValue
    },
    methods: {
      updateError (e) {
        console.log(e)
      },
    },
  }
</script>
