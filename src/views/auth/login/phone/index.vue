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
              @click="toRoute('/login/email')"
            >
              <v-img
                src="@/assets/svg/mail-outline.svg"
                max-width="21px"
                max-height="21px"
                style="margin-right: 8px;"
              />
              Войти по email
            </v-btn>
          </div>
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
          phone: null,
        },
        valid: true,
        visible1: false,
        phoneRules: [
          v => !!v || 'Телефон обязателен',
        ],
        loading: false,
      }
    },
    computed: {
      ...mapGetters(['auth']),
    },
    mounted () {
      this.$store.dispatch('auth/InitDevice')
    },
    methods: {
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      checkCapslock (e) {
        const { key } = e
        this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
      },
      showPwd () {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },

      async handleLogin () {
        // обнуляем merchants
        // this.$store.commit("auth/merchant/clearState", null);
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
          this.afterLoginSuccess()
        } finally {
          this.loading = false
        }
      },

      afterLoginSuccess () {
        // выбор merchant'а, если их несколько или вход, т.к. токен уже содержит merchant_id
        // console.log("afterLoginSuccess", this.merchants);
        this.showFields = false
        if (this.auth.merchant) {
          // if (this.merchant.show_modal) {
          //   this.$router.push('/wizard')
          // } else if (this.$route !== '/office') {
          //   this.$router.push('/office')
          // }
          this.$router.push('/dashboard')
        } else if (this.merchants && this.merchants.length > 1) {
          this.merchantDialog = true
        }
      },
      getOtherQuery (query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      },
    },
  }
</script>

<style lang="sass" scoped>
@import "~@/sass/auth"
</style>
