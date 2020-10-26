<template>
  <div class="cert-details-user-block">
    <div class="cert-details-user-content">
      <div class="cert-details-user d-flex">
        <img :src="user.avatar">
      </div>
      <div class="cert-details-user-info">
        <div>
          <div class="body-l-semibold">
            {{ user.UserName }}
          </div>
          <div
            v-if="user.last_activity"
            class="cert-details-user-activity body-xs-semibold"
          >
            Был(а) в сети
            {{ $moment(user.last_activity).format("DD.MM.YYYY\u00A0HH:mm") }}
          </div>

          <div class="cert-details-user-contact d-flex">
            <v-icon>$iconify_bi-phone</v-icon>
            <div class="body-m-medium">
              {{ user.phone || "-" }}
            </div>
          </div>
          <div class="cert-details-user-contact d-flex">
            <v-icon>$iconify_carbon-email</v-icon>
            <div class="body-m-medium">
              {{ user.email || "-" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    mixins: [],
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {}
    },
    computed: {},
    mounted () {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
</style>
