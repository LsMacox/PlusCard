<template>
  <div class="auth-content">
    <div
      class="auth-content-box"
    >
      <div
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
            На указанный электронный адрес выслано письмо.<br>Перейдите по ссылке для подтверждения регистрации.
          </div>
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
