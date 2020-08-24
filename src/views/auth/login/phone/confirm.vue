<template>
  <div class="auth-content">
    <div
      class="back-button"
    >
      <back-button
        @click.native="toRoute ('/login/phone')"
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
          >
            Введите код
          </div>
        </div>
      </div>
      <v-form
        ref="form"
        v-model="valid"
        class="auth-form"
        style="width: 248px;"
      >
        <div style="display: flex;">
          <input
            ref="num1"
            v-model="form.num1"
            class="auth-form-code-num"
            maxlength="1"
            @input="selectNumBox('num1')"
          >

          <input
            ref="num2"
            v-model="form.num2"
            class="auth-form-code-num"
            maxlength="1"
            @input="selectNumBox('num2')"
          >

          <input
            ref="num3"
            v-model="form.num3"
            class="auth-form-code-num"
            maxlength="1"
            @input="selectNumBox('num3')"
          >

          <input
            ref="num4"
            v-model="form.num4"
            class="auth-form-code-num"
            maxlength="1"
            @input="selectNumBox('num4')"
          >
        </div>
        <div
          class="auth-form-action"
          style="margin-top: 34px;"
        >
          <v-btn
            color="primary"
            style="width: 100%;"
            :loading="loading"
            :disabled="!valid"
            @click="confirm()"
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
      </v-form>
    </div>
    <div
      v-else
      class="auth-content-box"
    >
      <div class="merchant-select-header">
        Продолжить работу:
      </div>
      <div class="merchant-select-box app__scroll-y">
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
  </div>
</template>

<script>
  import BackButton from '@/views/auth/components/BackButton'
  import { mask } from 'vue-the-mask'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      BackButton,
    },
    directives: { mask },
    data () {
      return {
        form: {
          num1: null,
          num2: null,
          num3: null,
          num4: null,
        },
        valid: true,
        visible1: false,
        codeRules: [
          v => !!v || '',
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
      ...mapGetters('auth/phone', [
        'loginId',
      ]),
    },
    mounted () {
      this.$store.dispatch('auth/auth/InitDevice')
    },
    methods: {
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      selectNumBox (ref) {
        if (ref === 'num1') {
          this.form.num1 = this.form.num1.replace(/\D/g, '')
          if (this.form.num1) this.$refs.num2.focus()
        }
        if (ref === 'num2') {
          this.form.num2 = this.form.num2.replace(/\D/g, '')
          if (this.form.num2) this.$refs.num3.focus()
          else this.$refs.num1.focus()
        }
        if (ref === 'num3') {
          this.form.num3 = this.form.num3.replace(/\D/g, '')
          if (this.form.num3) this.$refs.num4.focus()
          else this.$refs.num2.focus()
        }
        if (ref === 'num4') {
          this.form.num4 = this.form.num4.replace(/\D/g, '')
          if (!this.form.num4) this.$refs.num3.focus()
        }
      },
      clearPhoneMask (p) {
        if (p) {
          p = String(p).match(/\d/g)
          if (p) p = p.join('')
        }
        return p
      },
      async confirm () {
        const login = {
          id: this.loginId,
          code: this.form.num1 + this.form.num2 + this.form.num3 + this.form.num4,
          device_id: this.device.id,
          device_token: this.device.token,
          device_type: this.device.type,
        }
        console.log(login)
        try {
          this.loading = true
          await this.$store.dispatch('auth/phone/confirm', login)
          // выбор мерчанта для логина или сразу логин
          if (this.merchants.length > 1) this.selectMerchant = true
          else this.toRoute('/dashboard')
        } finally {
          this.loading = false
        }
      },
      async login (merchId = null) {
        const login = {
          id: merchId,
          access_token: this.$session.get('access_token'),
        }
        console.log(login)
        try {
          this.loading = true
          await this.$store.dispatch('auth/merchant/login', login)
          // выбор мерчанта для логина или сразу логин
          this.toRoute('/dashboard')
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
