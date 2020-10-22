<template>
  <div class="auth-content">
    <div
      class="back-button"
    >
      <back-button
        @click.native="toRoute ('/login/phone')"
      />
    </div>

    <div
      v-if="!selectMerchant"
      class="auth-content-box"
    >
      <div class="header-box">
        <div style="display: flex;">
          <div
            class="header"
          >
            Введите код
          </div>
        </div>
      </div>
      <v-form
        ref="form"
        class="auth-form"
        style="width: 248px;"
        @submit.prevent="confirm()"
      >
        <div style="display: flex;">
          <input
            ref="num1"
            v-model="form.num1"
            class="auth-form-code-num"
            maxlength="1"
            :rules="codeRules"
            @keypress="onKeyPress($event, 1)"
            @input="selectNumBox($event,'num1')"
          >

          <input
            ref="num2"
            v-model="form.num2"
            class="auth-form-code-num"
            maxlength="1"
            :rules="codeRules"
            @keypress="onKeyPress($event, 2)"
            @input="selectNumBox($event,'num2')"
          >

          <input
            ref="num3"
            v-model="form.num3"
            class="auth-form-code-num"
            maxlength="1"
            :rules="codeRules"
            @keypress="onKeyPress($event, 3)"
            @input="selectNumBox($event,'num3')"
          >

          <input
            ref="num4"
            v-model="form.num4"
            class="auth-form-code-num"
            maxlength="1"
            :rules="codeRules"
            @keypress="onKeyPress($event, 4)"
            @input="selectNumBox($event,'num4')"
          >
        </div>
        <div
          class="auth-form-action"
          style="margin-top: 34px;"
        >
          <v-btn
            color="primary"
            style="width: 100%;"
            :loading="loading"
            :disabled="!valid"
            @click="confirm()"
          >
            <span
              class="iconify"
              style="margin-right: 8px;"
              data-icon="ion:log-out-outline"
              data-inline="false"
            />
            Войти в аккаунт
          </v-btn>
        </div>
        <div
          class="auth-form-forgot-password"
          @click="sendSMSCode()"
        >
          Отправить код еще раз
        </div>
      </v-form>
    </div>
    <select-merchant
      v-else
      :merchants="merchants"
      @select="login"
    />
  </div>
</template>

<script>

  import { mask } from 'vue-the-mask'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      BackButton: () => import('@/views/auth/components/BackButton'),
      SelectMerchant: () => import('@/views/auth/components/SelectMerchant'),
    },
    directives: { mask },
    props: {
      phone: {
        type: String,
        required: true,
      },
    },
    data () {
      return {
        form: {
          num1: null,
          num2: null,
          num3: null,
          num4: null,
        },
        visible1: false,
        codeRules: [
          v => (!!v && /^\d{1}$/.test(v)) || '',
        ],
        loading: false,
        selectMerchant: false,
      }
    },
    computed: {
      ...mapGetters('auth/auth', [
        'merchants',
        'merchant',
        'device',
      ]),
      ...mapGetters('auth/phone', [
        'loginId',
      ]),
      valid () {
        if (this.form.num1 && this.form.num2 && this.form.num3 && this.form.num4) return true
        return false
      },
    },
    mounted () {
      this.$store.dispatch('auth/auth/InitDevice')
      this.clearCode()
      if (!this.phone || !this.loginId) {
        this.$router.push({
          path: '/login/phone',
        })
      }
    },
    methods: {
      onKeyPress (e, refIndex) {
        const refId = 'num' + refIndex

        const enterChar = e.key
        console.log('onKeyPress', { refId, enterChar })
        if (enterChar === 'Enter' && refIndex === 4) {
          if (this.valid) this.confirm()
        } else if (/^\d$/.test(enterChar) && !!this.form[refId]) {
          this.form[refId] = enterChar
          if (refIndex < 4) {
            const nextRefId = 'num' + (refIndex + 1)
            const el = this.$refs[nextRefId]
            console.log('ref', el)
            if (el) el.focus()
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
      async sendSMSCode () {
        this.clearCode()
        const user = {
          phone: this.phone,
          device_id: this.device.id,
          device_token: this.device.token,
          device_type: this.device.type,
        }
        console.log(user)
        try {
          this.loading = true
          await this.$store.dispatch('auth/phone/login', user)
        } catch (e) {
          this.$router.push({
            path: '/login/phone',
          })
        } finally {
          this.loading = false
        }
      },
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      selectNumBox (e, ref) {
        console.log('selectNumBox', e, ref)
        // значение input
        const value = e.target.value

        if (ref === 'num1') {
          this.form.num1 = value.replace(/\D/g, '')
          if (this.form.num1) this.$refs.num2.focus()
        }
        if (ref === 'num2') {
          this.form.num2 = value.replace(/\D/g, '')
          if (this.form.num2) this.$refs.num3.focus()
          else if (!value) this.$refs.num1.focus()
        }
        if (ref === 'num3') {
          this.form.num3 = value.replace(/\D/g, '')
          if (this.form.num3) this.$refs.num4.focus()
          else if (!value) this.$refs.num2.focus()
        }
        if (ref === 'num4') {
          this.form.num4 = value.replace(/\D/g, '')
          if (!value) this.$refs.num3.focus()
        }
      },
      clearPhoneMask (p) {
        if (p) {
          p = String(p).match(/\d/g)
          if (p) p = p.join('')
        }
        return p
      },
      async confirm () {
        console.log('<confirm>')
        if (!this.valid) return

        const login = {
          id: this.loginId,
          code: this.form.num1 + this.form.num2 + this.form.num3 + this.form.num4,
          device_id: this.device.id,
          device_token: this.device.token,
          device_type: this.device.type,
        }
        console.log(login)
        try {
          this.loading = true
          await this.$store.dispatch('auth/phone/confirm', login)
          // выбор мерчанта для логина или сразу логин
          if (this.merchants.length > 1) this.selectMerchant = true
          else this.toRoute('/dashboard')
        } catch (e) {
          this.clearCode()
        } finally {
          this.loading = false
        }
      },
      async login (merchId = null) {
        const login = {
          id: merchId,
          access_token: this.$session.get('access_token'),
        }
        console.log(login)
        try {
          this.loading = true
          await this.$store.dispatch('auth/merchant/login', login)
          // выбор мерчанта для логина или сразу логин
          this.toRoute('/dashboard')
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="sass" scoped>
@import "~@/styles/auth"
</style>
