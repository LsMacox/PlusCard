<template>
  <v-row
    no-gutters
    class="user-column"
    align="baseline"
  >
    <v-col
      cols="auto"
      class="avatar-col"
    >
      <v-avatar size="25">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          :alt="UserName"
        >
        <v-icon
          v-else
          color="primary"
        >
          mdi-account-circle
        </v-icon>
      </v-avatar>
    </v-col>
    <v-col class="name-col">
      <div class="">{{ UserName }}</div>
      <div class="body-xs-semibold neutral-600--text">
        Был(а) в сети
        {{ $moment(user.last_activity).format("DD.MM.YYYY\u00A0HH:mm") }}
      </div>
    </v-col>
  </v-row>
  <!-- <div>
    <div class="avatar">
      <img :src="user.avatar">
    </div>
    <div class="td-content-wrapper">
      <div class="td-content-main">
        {{ UserName }}
      </div>
      <div
        v-if="user.last_activity"
        class="hint"
        style="color: #9191a1"
      >
        Был(а) в сети
        {{ $moment(item.user.last_activity).format("DD.MM.YYYY\u00A0HH:mm") }}
      </div>
    </div>
  </div> -->
</template>

  <script>
  export default {
    name: 'UserColumn',

    props: {
      user: {
        type: Object,
        required: true,
        default: () => {},
      },
    },
    computed: {
      UserName () {
        if (this.user) {
          if (this.user.UserName) {
            return this.user.UserName
          } else {
            if (this.user.name || this.user.lastname || this.user.middlename) {
              return [this.user.lastname, this.user.name, this.user.middlename].join(' ').trim()
            } else {
              if (this.user.phone) return this.user.phone
              else if (this.user.email) return this.user.email
              else return 'Пользователь'
            }
          }
        } else {
          return ''
        }
      },
    },
    methods: {},
  }
</script>
<style lang="scss" scoped>
.user-column{
    margin: 0px -4px;
}
.avatar-col, .name-col {
    margin: 0px 4px;
}

.avatar {
  width: 25px;
  height: 25px;
  border-radius: 40px;
  margin-right: 8px;
}
</style>
