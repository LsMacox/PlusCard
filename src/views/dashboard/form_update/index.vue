<template>
  <div
    v-if="!loading"
  >
    <router-view />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        programId: null,
      }
    },
    async created () {
      const id = this.$route.params.program_id
      this.programId = id
      if (id !== 'new') {
        await this.fetchData()
      }
    },
    methods: {
      async fetchData () {
        try {
          this.loading = true
          await this.$store.dispatch('company/program/read', { id: this.programId })
          // await this.$store.dispatch('company/program/listShop', { id: this.programId })
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-update.scss';
</style>
