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
          v-model="form.company_name"
          placeholder="Введите название компании"
          class="auth-text-field"
          outlined
          required
          :rules="[
            v => !!v || 'Назваание компании обязательно',
            v => String(v).length <= 100 || 'Название компании не должно быть более 100 символов',
          ]"
          :validate-on-blur="false"
        >
          <template slot="prepend-inner">
            <span
              class="iconify"
              data-icon="bx-bx-building-house"
              data-inline="false"
            />
          </template>
        </v-text-field>

        <v-text-field
          v-model="form.email"
          placeholder="Введите еmail"
          class="auth-text-field"
          outlined
          required
          :rules="emailRules"
          :validate-on-blur="false"
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
          v-mask="'+7 (###) ###-##-##'"
          placeholder="Введите телефон"
          class="auth-text-field"
          outlined
          required
          :rules="phoneRules"
          :validate-on-blur="false"
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
          :validate-on-blur="false"
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
          :validate-on-blur="false"
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

        <v-row
          class="auth-checkbox"
          no-gutters
          align="baseline"
        >
          <v-checkbox
            v-model="accept"
            dense
          />
          <div class="body-m-medium neutral-900--text auth-checkbox-text">
            Принимаю <span
              class="primary--text"
              @click="showPartnerDocClick()"
            >партнерское соглашение</span>
          </div>
        </v-row>

        <div class="auth-form-action">
          <v-btn
            color="primary"

            block
            :loading="loading"
            :disabled="!(valid && accept)"
            @click="submit()"
          >
            <v-icon left>
              $iconify_feather-users
            </v-icon>
            Создать аккаунт
          </v-btn>
        </div>
      </v-form>
    </div>

    <vue-recaptcha
      ref="recaptcha"
      size="invisible"
      :sitekey="$config.app.RECAPTCHA_SITE_KEY"
      :load-recaptcha-script="true"
      @verify="registration"
      @expired="onCaptchaExpired"
    />

    <message-box
      v-model="showPartnerDoc"
      scrollable
      title="Партнерское соглашение"
      max-width="80%"
    >
      <policy-text />
    </message-box>
  </div>
</template>

<script>
  import { mask } from 'vue-the-mask'
  import VueRecaptcha from 'vue-recaptcha'
  import { mapGetters } from 'vuex'
  import { validEmail } from '@/utils/validate.js'
  import { validPhone } from '@/utils/validate'

  export default {
    components: {
      VueRecaptcha,
      MessageBox: () => import('@/components/message-box/MessageBox.vue'),
      PolicyText: () => import('@/views/auth/components/PolicyText.vue'),
    },
    directives: { mask },
    data () {
      return {
        form: {
          company_name: null,
          email: null,
          phone: null,
          password: null,
        },
        showPartnerDoc: false,
        valid: true,
        visible1: false,
        visible2: false,
        accept: false,
        emailRules: [
          v => !!v || 'Введите E-mail',
          v => validEmail(v) || 'E-mail неверного формата',
        ],
        phoneRules: [
          v => (!!v && validPhone(v)) || 'Введите телефон',
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
        'client',
      ]),
    },
    mounted () {
      this.$store.dispatch('auth/auth/InitDevice')
    },
    methods: {
      showPartnerDocClick () {
        // this.$alert('sdfsdf')
        this.showPartnerDoc = true
      },
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      onCaptchaExpired () {
        this.$refs.recaptcha.reset()
      },
      clearPhoneMask (p) {
        if (p) {
          p = String(p).match(/\d/g)
          if (p) p = p.join('')
        }
        return p
      },
      submit () {
        if (!this.$refs.form.validate()) return
        this.$refs.recaptcha.execute()
      },
      async registration (recaptchaToken) {
        const user = {
          company_name: this.form.company_name,
          email: this.form.email,
          phone: this.clearPhoneMask(this.form.phone),
          password: this.form.password,
          device_id: this.device.id,
          device_token: this.device.token,
          device_type: this.device.type,
          recaptcha_token: recaptchaToken,
          client: this.client,
        }
        console.log(user)
        try {
          this.loading = true
          await this.$store.dispatch('auth/email/registration', user)
          this.toRoute('/registration/send')
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
