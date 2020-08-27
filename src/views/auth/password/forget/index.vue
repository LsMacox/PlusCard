<template>
  <div class="auth-content">
    <div
      v-if="!emailSend"
      class="back-button"
    >
      <back-button
        @click.native="$router.push('/login')"
      />
    </div>

    <div
      v-if="!emailSend"
      class="auth-content-box"
    >
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

        <div
          class="auth-form-action"
        >
          <v-btn
            color="primary"
            style="width: 100%;"
            :loading="loading"
            @click="forget()"
          >
            <span
              class="iconify"
              style="margin-right: 8px;"
              data-icon="bx:bx-lock-open-alt"
              data-inline="false"
            />
            Восстановить пароль
          </v-btn>
        </div>
      </v-form>
    </div>

    <div
      v-else
      class="auth-content-box"
    >
      <v-img
        src="@/assets/svg/auth-forget-mail-send.svg"
        width="215px"
        height="215px"
        style="margin: 0 auto;"
      />
      <div
        class="header-box"
        style="text-align: center;"
      >
        <div
          class="header"
        >
          Письмо отправлено
        </div>
        <div
          class="header-text"
        >
          На указанный электронный адрес выслано письмо.<br>Перейдите по ссылке для смены пароля.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import BackButton from '@/views/auth/components/BackButton'

  export default {
    components: {
      BackButton,
    },
    data () {
      return {
        form: {
          email: null,
          password: null,
        },
        valid: true,
        visible1: false,
        emailRules: [
          v => !!v || 'E-mail обязателен',
          v => /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,10}$/.test(v) || 'E-mail неверного формата',
        ],
        loading: false,
        emailSend: false,
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
      async forget () {
        const item = {
          email: this.form.email,
        }
        try {
          this.loading = true
          await this.$store.dispatch('auth/password/forget', item)
          this.emailSend = true
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
