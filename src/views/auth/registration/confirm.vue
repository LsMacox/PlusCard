<template>
  <div class="auth-content">
    <div
      class="auth-content-box"
    >
      <div
        class="auth-content-box"
      >
        <v-img
          src="@/assets/svg/auth-side-password-changed.svg"
          width="92px"
          height="79px"
          style="margin: 0 auto 34px auto;"
        />
        <div
          class="header-box"
          style="text-align: center;"
        >
          <div
            class="header"
          >
            Email подтвержден!
          </div>
          <div
            class="header-text"
          >
            Используйте ваш email и пароль для входа<br>в личный кабинет
          </div>
        </div>
        <div style="text-align: center;">
          <v-btn
            color="primary"
            @click="toRoute('/login/email')"
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
@import "~@/sass/auth"
</style>
