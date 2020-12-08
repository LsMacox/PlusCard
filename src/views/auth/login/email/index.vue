<template>
  <div class="auth-content">
    <div
      v-if="selectMerchant"
      class="back-button"
    >
      <back-button
        @click.native="selectMerchant = false"
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
            @click="toRoute ('/login')"
          >
            Вход
          </div>
          <div
            class="header inactive"
            style="margin-left: 34px;"
            @click="toRoute ('/registration')"
          >
            Регистрация
          </div>
        </div>
      </div>
      <v-form
        ref="form"
        v-model="valid"
        class="auth-form"
      >
        <v-text-field
          v-model="form.email"
          placeholder="Введите еmail"
          class="auth-text-field"
          outlined
          required
          :rules="emailRules"
          validate-on-blur
          @blur="form.email = form.email ? form.email.trim() : null"
        >
          <template slot="prepend-inner">
            <span
              class="iconify"
              data-icon="ion:mail-outline"
              data-inline="false"
            />
          </template>
        </v-text-field>

        <v-text-field
          v-model="form.password"
          :type="visible1 ? 'text' : 'password'"
          placeholder="Введите пароль"
          class="auth-text-field"
          outlined
          required
          :rules="passwordRules"
        >
          <template slot="prepend-inner">
            <span
              class="iconify"
              data-icon="bx:bx-lock-open-alt"
              data-inline="false"
            />
          </template>
          <template slot="append">
            <v-img
              v-if="visible1"
              src="@/assets/svg/eye-on.svg"
              style="cursor: pointer;"
              @click="visible1 = !visible1"
            />
            <v-img
              v-else
              src="@/assets/svg/eye-off.svg"
              style="cursor: pointer;"
              @click="visible1 = !visible1"
            />
          </template>
        </v-text-field>

        <div
          class="auth-form-action"
          style="margin-top: 10px;"
        >
          <div
            style="display: inline-grid; margin-right: 5px;"
          >
            <v-btn
              color="primary"
              style="width: 100%;"
              :loading="loading"
              :disabled="!valid"
              @click="submit()"
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
            style="display: inline-grid; margin-left: 5px;"
          >
            <v-btn
              color="secondary"
              style="width: 100%;"
              @click="toRoute('/login/phone')"
            >
              <span
                class="iconify"
                style="margin-right: 8px;"
                data-icon="bi:phone"
                data-inline="false"
              />
              Войти по номеру
            </v-btn>
          </div>
        </div>
        <div
          class="auth-form-forgot-password"
          @click="toRoute('/password/forget')"
        >
          Забыли пароль?
        </div>
      </v-form>
    </div>
    <select-merchant
      v-else
      :merchants="merchants"
      @select="login"
    />
    <vue-recaptcha
      ref="recaptcha"
      size="invisible"
      :sitekey="$config.app.RECAPTCHA_SITE_KEY"
      :load-recaptcha-script="true"
      @verify="login"
      @expired="onCaptchaExpired"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import BackButton from '@/views/auth/components/BackButton'
  import { validEmail } from '@/utils/validate.js'
  import VueRecaptcha from 'vue-recaptcha'

  export default {
    components: {
      BackButton,
      VueRecaptcha,
      SelectMerchant: () => import('@/views/auth/components/SelectMerchant'),
    },
    data () {
      return {
        valid: false,
        form: {
          email: null,
          password: null,
        },
        visible1: false,
        emailRules: [
          v => !!v || 'E-mail обязателен',
          v => validEmail(v) || 'E-mail неверного формата',
        ],
        passwordRules: [
          v => !!v || 'Пароль обязателен',
          v => /^[^а-яА-Я]+$/gm.test(v) || 'Указан недопустимый символ',
        ],
        loading: false,
        selectMerchant: false,
      }
    },
    computed: {
      ...mapGetters('auth/auth', [
        'merchants',
        'merchant_id',
        'merchant',
        'device',
      ]),
    },
    mounted () {
      this.$store.dispatch('auth/auth/InitDevice')
      window.addEventListener('keyup', this.onKeyUp)
      if (this.$route.query.merch_id) this.$store.commit('auth/auth/SET_MERCHANT_ID', this.$route.query.merch_id)
    },
    beforeDestroy () {
      window.removeEventListener('keyup', this.onKeyUp)
    },
    methods: {
      submit () {
        if (!this.$refs.form.validate()) return
        this.$refs.recaptcha.execute()
      },
      onCaptchaExpired () {
        this.$refs.recaptcha.reset()
      },
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      onKeyUp (e) {
        if (this.valid && e.key === 'Enter') {
          this.login()
        }
      },
      async login (recaptchaToken) {
        const user = {
          email: this.form.email,
          password: this.form.password,
          device_id: this.device.id,
          device_token: this.device.token,
          device_type: this.device.type,
          recaptcha_token: recaptchaToken,
          merch_id: this.merchant_id,
        }
        console.log(user)
        try {
          this.loading = true
          await this.$store.dispatch('auth/email/login', user)
          // выбор мерчанта для логина или сразу логин
          if (this.merchants.length > 1) {
            this.selectMerchant = true
            this.valid = false
          } else {
            this.toRoute('/dashboard')
          }
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
