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
      <div class="body-xs-semibold neutral-600--text" v-if="showLastActivity">
        Был(а) в сети
        {{ user && user.last_activity ? $moment.utc(user.last_activity).local().format("DD.MM.YYYY\u00A0HH:mm") : '-' }}
      </div>
    </v-col>
  </v-row>
</template>

  <script>
  export default {
    name: 'UserColumn',

    props: {
      user: {
        type: [Object],
        required: true,
        default: () => {},
      },
      showLastActivity: {
        type: Boolean,
        default: true,
      }
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
