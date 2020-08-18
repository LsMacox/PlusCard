<template>
  <div class="auth-content">
    <div class="back-button">
      <back-button
        @click.native="$router.push('/login')"
      />
    </div>

    <div class="auth-content-box">
      <div class="header-box">
        <div
          class="header"
        >
          Восстановление пароля
        </div>
        <div
          class="header-text"
        >
          Для сброса пароля, введите электронный адрес<br>указанный при регистрации.
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
        >
          <template slot="prepend-inner">
            <v-img
              src="@/assets/svg/mail-outline.svg"
            />
          </template>
        </v-text-field>

        <div
          class="auth-form-action"
          style="margin-top: 34px;"
        >
          <v-btn
            color="primary"
            style="width: 100%;"
          >
            <v-img
              src="@/assets/svg/lock-open-outline-white.svg"
              max-width="21px"
              max-height="21px"
              style="margin-right: 8px;"
            />
            Восстановить пароль
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
  import { validUsername } from '@/utils/validate'
  import { mapGetters } from 'vuex'
  import BackButton from '@/views/auth/components/BackButton'

  export default {
    components: {
      BackButton,
    },
    data () {
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      }
      return {
        visible1: false,
        valid: true,
        merchantDialog: false,
        form: {
          email: null,
          password: null,
        },
        loginRules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              validator: validateUsername,
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
        },
        passwordType: 'password',
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
