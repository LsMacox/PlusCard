<template>
  <div class="auth-content">
    <div class="auth-content-box">
      <div class="header-box">
        Продолжить работу:
      </div>
    </div>
  </div>
</template>

<script>
  import { validUsername } from '@/utils/validate'
  import { mapGetters } from 'vuex'

  export default {
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
      async login () {
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
    },
  }
</script>

<style lang="sass" scoped>
@import "~@/sass/auth"
</style>
