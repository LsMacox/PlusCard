<template>
  <div class="auth-content">
    <div
      class="auth-content-box"
    >
      <div
        class="auth-content-box"
      >
        <v-img
          src="@/assets/png/loyalty-dummy.png"
          width="187px"
          style="margin: 0 auto 34px auto;"
        />
        <div
          class="header-box"
          style="text-align: center;"
        >
          <div
            class="header"
          >
            Ссылка недействительна :’(
          </div>
          <div
            class="header-text"
          >
            Истек срок действия ссылки для подтверждения email. Войти в аккаунт можно через восстановление пароля.
          </div>
        </div>
        <div style="text-align: center;">
          <v-btn
            color="primary"
            @click="toRoute('/password/forget')"
          >
            <span
              class="iconify"
              style="margin-right: 8px;"
              data-icon="ion:log-out-outline"
              data-inline="false"
            />
            Восстановить пароль
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {}
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
    },
  }
</script>

<style lang="sass" scoped>
@import "~@/styles/auth"
</style>
