<template>
  <div class="auth-content">
    <div class="auth-content-box">
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
        >
          <template slot="prepend-inner">
            <v-img
              src="@/assets/svg/mail-outline.svg"
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
            <v-img
              src="@/assets/svg/lock-open-outline.svg"
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
          style="margin-top: 34px;"
        >
          <div
            style="display: inline-grid; margin-right: 5px;"
          >
            <v-btn
              color="primary"
              style="width: 100%;"
              :loading="loading"
              :disabled="!valid"
              @click="login()"
            >
              <v-img
                src="@/assets/svg/log-in-outline.svg"
                max-width="21px"
                max-height="21px"
                style="margin-right: 8px;"
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
              <v-img
                src="@/assets/svg/phone-outline.svg"
                max-width="21px"
                max-height="21px"
                style="margin-right: 8px;"
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
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        form: {
          email: null,
          password: null,
        },
        valid: false,
        visible1: false,
        emailRules: [
          v => !!v || 'E-mail обязателен',
          v => /.+@.+/.test(v) || 'E-mail неверного формата',
        ],
        passwordRules: [
          v => !!v || 'Пароль обязателен',
          // v => /[^а-яА-Я]/gm.test(v) || 'Указан недопустимый символ',
        ],
        loading: false,
      }
    },
    computed: {
      ...mapGetters('auth', [
        'merchants',
        'merchant',
        'device',
      ]),
    },
    mounted () {
      this.$store.dispatch('auth/InitDevice')
    },
    methods: {
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      async login () {
        const user = {
          email: this.form.email,
          password: this.form.password,
          device_id: this.device.id,
          device_token: this.device.token,
          device_type: this.device.type,
        }
        try {
          this.loading = true

          await this.$store.dispatch('auth/EmailLogin', user)
          if (this.merchants.length > 1) this.toRoute('/login/company')
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="sass" scoped>
@import "~@/sass/auth"
</style>
