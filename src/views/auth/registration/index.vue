<template>
  <div class="auth-content">
    <div class="auth-content-box">
      <div class="header-box">
        <div style="display: flex;">
          <div
            class="header"
            @click="toRoute ('/registration')"
          >
            Регистрация
          </div>
          <div
            class="header inactive"
            style="margin-left: 34px;"
            @click="toRoute ('/login')"
          >
            Вход
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
          v-model="form.phone"
          placeholder="Введите телефон"
          class="auth-text-field"
          outlined
          required
          :rules="phoneRules"
          validate-on-blur
        >
          <template slot="prepend-inner">
            <v-img
              src="@/assets/svg/flag_russia.svg"
            />
          </template>
        </v-text-field>

        <v-text-field
          v-model="form.password"
          :type="visible1 ? 'text' : 'password'"
          placeholder="Введите новый пароль"
          class="auth-text-field"
          outlined
          required
          :rules="passwordRules"
          validate-on-blur
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

        <v-text-field
          v-model="form.passwordConfirm"
          :type="visible2 ? 'text' : 'password'"
          placeholder="Повторите новый пароль"
          class="auth-text-field"
          outlined
          required
          :rules="passwordConfirmRules"
          validate-on-blur
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
              v-if="visible2"
              src="@/assets/svg/eye-on.svg"
              style="cursor: pointer;"
              @click="visible2 = !visible2"
            />
            <v-img
              v-else
              src="@/assets/svg/eye-off.svg"
              style="cursor: pointer;"
              @click="visible2 = !visible2"
            />
          </template>
        </v-text-field>

        <div class="auth-checkbox">
          <v-checkbox
            v-model="accept"
          />
          <div class="auth-checkbox-text">
            Принимаю <span>партнерское соглашение</span>
          </div>
        </div>

        <div class="auth-form-action">
          <v-btn
            color="primary"
            style="width: 100%;"
            :disabled="!accept"
          >
            <span
              class="iconify"
              style="margin-right: 8px;"
              data-icon="feather:users"
              data-inline="false"
            />
            Создать аккаунт
          </v-btn>
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
          phone: null,
          password: null,
        },
        valid: true,
        visible1: false,
        visible2: false,
        accept: false,
        emailRules: [
          v => !!v || 'E-mail обязателен',
          v => /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,10}$/.test(v) || 'E-mail неверного формата',
        ],
        phoneRules: [
          v => !!v || 'Телефон обязателен',
        ],
        passwordRules: [
          v => !!v || 'Пароль обязателен',
          v => /^[^а-яА-Я]+$/gm.test(v) || 'Указан недопустимый символ',
          v => (v && v.length >= 8) || 'Пароль должен быть не менее 8 символов',
        ],
        passwordConfirmRules: [
          v => v === this.form.password || 'Пароли не совпадают',
        ],
        loading: false,
      }
    },
    computed: {
      ...mapGetters('auth/auth', [
        'merchants',
        'merchant',
        'device',
      ]),
    },
    mounted () {
      this.$store.dispatch('auth/auth/InitDevice')
    },
    methods: {
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      async registration () {
        const user = {
          email: this.form.email,
          password: this.form.password,
          device_id: this.auth.device.id,
          device_token: this.auth.device.token,
          device_type: this.auth.device.type,
        }
        try {
          this.loading = true
          await this.$store.dispatch('auth/EmailLogin', user)
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
