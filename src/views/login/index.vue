<template>
  <div class="login-container">
    <v-form
      ref="loginForm"
      v-model="valid"
    >
      <v-text-field
        v-model="loginForm.email"
        label="E-mail"
        required
      />

      <v-text-field
        v-model="loginForm.password"
        label="password"
        required
      />

      <v-btn
        :loading="loading"
        @click.native.prevent="handleLogin"
      >
        Login
      </v-btn>
    </v-form>
  </div>
</template>

<script>
  import { validUsername } from '@/utils/validate'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Login',
    components: {},
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
        valid: true,
        merchantDialog: false,
        loginForm: {
          email: 'Granovskiy@pluscards.ru',
          password: '9511818783',
        },
        loginRules: {
          username: [
            { required: true, trigger: 'blur', validator: validateUsername },
          ],
          password: [
            { required: true, trigger: 'blur', validator: validatePassword },
          ],
        },
        passwordType: 'password',
        loading: false,
      }
    },
    computed: {
      ...mapGetters(['auth']),
    },
    watch: {
      $route: {
        handler: function (route) {
          const query = route.query
          if (query) {
            this.redirect = query.redirect
            this.otherQuery = this.getOtherQuery(query)
          }
        },
        immediate: true,
      },
    },
    mounted () {
      this.$store.dispatch('auth/InitDevice')
    },
    methods: {
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
          email: this.loginForm.email,
          password: this.loginForm.password,
          device_id: this.auth.device.id,
          device_token: this.auth.device.token,
          device_type: this.auth.device.type,
        }
        try {
          this.loading = true

          await this.$store.dispatch('auth/emailLogin', user)
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

<style lang="scss" scoped>
</style>
