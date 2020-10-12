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
        @submit.prevent="login()"
      >
        <v-text-field
          v-model="form.phone"
          v-mask="'+7 (###) ###-##-##'"
          placeholder="Введите телефон"
          class="auth-text-field"
          outlined
          required
          :rules="phoneRules"
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
              :loading="loading"
              :disabled="!valid"
              @click="login()"
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
              to="/login/email"
            >
              <span
                class="iconify"
                data-icon="ion:mail-outline"
                data-inline="false"
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
  import { mask } from 'vue-the-mask'
  import { mapGetters } from 'vuex'

  export default {
    directives: { mask },
    data () {
      return {
        form: {
          phone: null,
        },
        valid: true,
        visible1: false,
        phoneRules: [
          v => (!!v && v.length === 18) || 'Телефон обязателен',
          v => (!!v && /^(\+7|7|8)+\ \(\d{3}\)\ \d{3}\-\d{2}\-\d{2}$/.test(v)) || 'Не верный формат телефона',
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
    },
    mounted () {
      this.$store.dispatch('auth/auth/InitDevice')
    },
    methods: {
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      toConfirm (phone) {
        console.log('toConfirm', phone)
        this.$router.push({
          path: '/login/phone/confirm',
          query: { phone },
        })
      },
      clearPhoneMask (p) {
        if (p) {
          p = String(p).match(/\d/g)
          if (p) p = p.join('')
        }
        return p
      },
      async login () {
        console.log('<login>')

        if (!this.$refs.form.validate()) return

        const user = {
          phone: this.clearPhoneMask(this.form.phone),
          device_id: this.device.id,
          device_token: this.device.token,
          device_type: this.device.type,
        }
        console.log(user)
        try {
          this.loading = true
          await this.$store.dispatch('auth/phone/login', user)
          this.toConfirm(user.phone)
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
