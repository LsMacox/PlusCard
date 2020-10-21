
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
    @blur="onBlur"
    @focus="onFocus"
    @input="onInput"
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
        class="append-slot-row"
        align="center"        
      >
        <v-col
          v-if="false"
          class="append-slot-row__col"
        >
          <slot name="append" />
          <!-- hasError={{ hasError }} -->
        </v-col>

        <v-col
          cols="auto"
          class="append-slot-row__col body-xs-semibold"
        >
          <span
            v-if="!!counter"
            :class="{
              'error--text': isRequired || isGreater,
              'success--text': !(isRequired || isGreater),
              'base-counter': true,
            }"
          >
            {{ computedMaxCounter ? `${computedCounterValue} / ${computedMaxCounter}` : String(computedCounterValue) }}
          </span>
        </v-col>
        <v-col
          cols="auto"          
          class="append-slot-row__col"
        >
          <!-- <div class="dev-tooltip">dev-tooltip</div> -->
          <base-tooltip
            v-if="hasDispayErrors && !disabled"
            :value="true"
            :disabled="disabled"
            text=""
            color="error"
            :top="validationPlacement === 'top'"
            :right="validationPlacement === 'right'"
            :left="validationPlacement === 'left'"
            :bottom="validationPlacement === 'bottom'"           
          >
          <!-- :attach="$refs.vTextField.$el" -->
            <v-icon
              v-show="hasDispayErrors"
              color="error"
              @click="showError = !showError"
            >
              $iconify_ion-warning
            </v-icon>
            <template v-slot:content>
              <div
                v-for="(error, index) in errorMessagesToDisplay"
                :key="index"
              >
                {{ error }}
              </div>
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

  import { VTextField, VInput } from 'vuetify/lib'
  import Validatable from 'vuetify/lib/mixins/validatable'

  export default {
    name: 'Textfield',
    mixins: [
      VTextField,
      // VInput,
      Validatable,
    ],
    model: {
      prop: 'value',
      event: 'input',
    },
    props: {
      //
      maxlength: [String, Number],
      validationPlacement: {
        type: String,
        default: 'right',

      },
      // value: {
      //   type: [String, Number],
      //   default: null,
      // },

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
      // errorCount: [Number, String],
      // errorMessages: [String, Array],
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
      // messages: [String, Array],
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
      // readonly: Boolean,
      // rules: Array,
      shaped: Boolean,
      singleLine: Boolean,
      // success: Boolean,
      // successMessages: [Array, String],
      suffix: String,
      type: String,
      // validateOnBlur: Boolean,

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
        computedCounterValue2: 0,
      }
    },
    computed: {
      hasDispayErrors () {
        return this.errorMessagesToDisplay.length > 0
      },
      // computedCounterValue () {
      //   return this.$refs.vTextField ? this.$refs.vTextField.computedCounterValue : 0
      // },
      computedMaxCounter () {
        return this.counter === true ? this.maxlength : this.counter
      },
      errorMessagesToDisplay () {
        // console.log('this.onFocus', this.onFocus)
        // console.log('this.form', this.form)
        // console.log('this.isDisabled', this.isDisabled)
        // console.log('this.validateOnBlur', this.validateOnBlur)
        // console.log('this.hasFocused && !this.isFocused ', this.hasFocused, !this.isFocused)
        // console.log('this.shouldValidate', this.shouldValidate)
        // console.log('this.errorBucket', this.errorBucket)

        // console.log('this.validationTarget', this.validationTarget)
        // console.log('this.validations', this.validations)

        return this.validations.map(validation => {
          if (typeof validation === 'string') return validation
          const validationResult = validation(this.internalValue)
          return typeof validationResult === 'string' ? validationResult : ''
        }).filter(message => message !== '')
      },
      isRequired () {
        return !!this.minlength && this.computedCounterValue < this.minlength
      },
      isGreater () {
        return !!this.computedMaxCounter && this.computedCounterValue > this.maxlength
      },
      isFilledText () {
        return !!this.value && this.value.length >= this.minlength
      },
      isSuccess () {
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
      // console.log('this.$refs.vTextField', this.$refs.vTextField)

    },
    methods: {
      updateError (e) {
        console.log(e)
      },
      onFocus (e) {
        if (!this.$refs.vTextField) return

        // if (document.activeElement !== this.$refs.input) {
        //   return this.$refs.input.focus();
        // }

        if (!this.isFocused) {
          this.isFocused = true
          e && this.$emit('focus', e)
        }
      },
      onBlur (e) {
        this.isFocused = false
        e && this.$nextTick(() => this.$emit('blur', e))
      },
      onInput (e) {        
        // console.log('onInput', e)
        e && this.$nextTick(() => this.$emit('input', e))
      },
      onClick () {
      // if (this.isFocused || this.isDisabled || !this.$refs.vTextField) return;
      // this.$refs.input.focus();
      },

    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/_typography";

.append-slot-row {
  min-height: calc(45px - 12px - 12px);
  // width: max-content;
  margin: 0px -4px;
  .append-slot-row__col{
    margin-left: 4px;
    margin-right: 4px;
  }
  .base-counter {
     @include body-xs-semibold;
     white-space: nowrap;
  }
}
</style>
