<template>
  <v-form
    ref="smsForm"
    v-model="valid"
  >
    <v-row
      no-gutters
      class="sms-code-input-row"
    >
      <input
        v-for="item in codeArray"
        :key="item.id"
        :ref="`input${item.id}`"
        v-model="item.value"
        class="sms-code-input"
        maxlength="1"
        :rules="codeRules"
        @keypress="onKeyPress($event, item.id)"
        @input="selectNumBox($event, 'num1')"
      >
    </v-row>
  </v-form>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'SmsCodeInput',
    model: {
      prop: 'value',
      event: 'change',
    },
    props: {
      count: {
        type: Number,
        default: 4,
      },
      value: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        valid: false,
        codeArray: [],
        codeRules: [
          v => (!!v && /^\d{1}$/.test(v)) || '',
        ],
      }
    },
    computed: {
      outputCode () {
        let code = ''
        for (let index = 0; index < this.codeArray.length; index++) {
          code += this.codeArray[index].value
        }
        return code
      },
    },
    watch: {
      value (v) {
        this.initCode()
      },
      outputCode (v) {
        console.log('update:outputCode')
        this.$emit('change', this.outputCode)
      },

    },
    created () {
      this.initCode()
    },
    mounted () {
      const el = this.$refs.input0
      if (el) el[0].focus()
    },
    methods: {
      selectNumBox () {},
      initCode () {
        for (let index = 0; index < this.count; index++) {
          Vue.set(this.codeArray, index, { id: index, value: this.value[index] || '' })
        }
      },
      onKeyPress (e, index) {
        const refPrefix = 'input'
        const refId = refPrefix + index

        const enterChar = e.key
        console.log('onKeyPress', { refId, enterChar })
        if (enterChar === 'Enter' && (index + 1) === this.count) {
          if (this.valid) this.$emit('confirm')
        } else if (/^\d$/.test(enterChar)) {
          this.codeArray[index].value = enterChar
          if ((index + 1) < this.count) {
            const nextRefId = refPrefix + (index + 1)
            const el = this.$refs[nextRefId]
            console.log('ref', el)
            if (el && el.length > 0) el[0].focus()
          }
        }

        // this.$refs[ref].
      },
      clearCode () {
        for (const key in this.form) {
          if (Object.prototype.hasOwnProperty.call(this.form, key)) {
            this.form[key] = ''
          }
        }
        this.$refs.num1.focus()
      },
    },
  }
</script>

<style lang="scss" scoped>
.sms-code-input-row {
  margin-left: -6px ;
  margin-right: -6px ;
}
.sms-code-input {
  margin-left: 6px ;
  margin-right: 6px ;
  width: 53px;
  height: 53px;
  border: 1px solid #d7d7e0;
  box-sizing: border-box;
  border-radius: 12px;
  margin: 0 8px 0 0;
  cursor: pointer;
  text-align: center;
  outline: none !important;
}
</style>
