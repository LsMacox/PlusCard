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
      >
        <div style="display: flex;">
          <input
            ref="num1"
            v-model="form.num1"
            class="auth-form-code-num"
            maxlength="1"
            @input="selectNumBox($event,'num1')"
          >

          <input
            ref="num2"
            v-model="form.num2"
            class="auth-form-code-num"
            maxlength="1"
            @input="selectNumBox($event,'num2')"
          >

          <input
            ref="num3"
            v-model="form.num3"
            class="auth-form-code-num"
            maxlength="1"
            @input="selectNumBox($event,'num3')"
          >

          <input
            ref="num4"
            v-model="form.num4"
            class="auth-form-code-num"
            maxlength="1"
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
          @click=""
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
          v => !!v || '',
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
    },
    methods: {
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      selectNumBox (e, ref) {
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
