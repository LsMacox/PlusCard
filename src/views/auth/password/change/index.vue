<template>
  <div class="auth-content">
    <div
      v-if="!passwordChanged"
      class="auth-content-box"
    >
      <div class="header-box">
        <div
          class="header"
        >
          Восстановление пароля
        </div>
      </div>
      <v-form
        ref="form"
        v-model="valid"
        class="auth-form"
      >
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

        <div
          class="auth-form-action"
        >
          <v-btn
            color="primary"
            style="width: 100%;"
            :loading="loading"
            @click="changePassword()"
          >
            <span
              class="iconify"
              data-icon="bx:bx-lock-open-alt"
              data-inline="false"
            />
            Изменить пароль
          </v-btn>
        </div>
      </v-form>
    </div>

    <div
      v-else
      class="auth-content-box"
    >
      <v-img
        src="@/assets/svg/auth-side-password-changed.svg"
        width="92px"
        height="79px"
        style="margin: 0 auto 34px auto;"
      />
      <div
        class="header-box"
        style="text-align: center;"
      >
        <div
          class="header"
        >
          Пароль изменен!
        </div>
        <div
          class="header-text"
        >
          Используйте новый пароль для следующего входа<br>в свой личный кабинет
        </div>
      </div>
      <div style="text-align: center;">
        <v-btn
          color="primary"
          @click="toRoute('/login/email')"
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
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        form: {
          password: null,
        },
        valid: true,
        visible1: false,
        visible2: false,
        passwordRules: [
          v => !!v || 'Пароль обязателен',
          v => /^[^а-яА-Я]+$/gm.test(v) || 'Указан недопустимый символ',
          v => (v && v.length >= 8) || 'Пароль должен быть не менее 8 символов',
        ],
        passwordConfirmRules: [
          v => v === this.form.password || 'Пароли не совпадают',
        ],
        loading: false,
        passwordChanged: false,
        loginId: null,
        token: null,
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
      this.loginId = this.$route.query.id
      this.token = this.$route.query.token
    },
    methods: {
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      async changePassword () {
        const item = {
          id: this.loginId,
          token: this.token,
          password: this.form.password,
        }
        try {
          this.loading = true
          await this.$store.dispatch('auth/password/change', item)
          this.passwordChanged = true
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
