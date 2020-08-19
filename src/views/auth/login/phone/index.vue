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
    <div
      v-else
      class="auth-content-box"
    >
      <div class="merchant-select-header">
        Продолжить работу:
      </div>
      <div
        v-for="(item, i) in merchants"
        :key="i"
        class="merchant-select-block"
        @click="login(item.id)"
      >
        <v-img
          src="@/assets/svg/plus_logo_sm.svg"
          max-width="46px"
          height="46px"
        />
        <div class="merchant-select-block-text">
          {{ item.name }}
        </div>
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
          phone: null,
        },
        valid: true,
        visible1: false,
        phoneRules: [
          v => !!v || 'Телефон обязателен',
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
      async login () {
        const user = {
          email: this.form.email,
          password: this.form.password,
          device_id: this.device.id,
          device_token: this.device.token,
          device_type: this.device.type,
        }
        console.log(user)
        try {
          this.loading = true

          await this.$store.dispatch('auth/phone/login', user)
          // выбор мерчанта для логина или сразу логин
          if (this.merchants.length > 1) this.selectMerchant = true
          else this.toRoute('/dashboard')
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
