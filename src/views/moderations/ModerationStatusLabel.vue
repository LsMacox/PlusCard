<template>
  <v-container class="pa-0">
    <v-row
      no-gutters
      style="margin: 0px -4px"
      align="center"
    >
      <v-col
        cols="auto"
        style="margin: 0px 4px"
      >
        <v-img
          height="21px"
          width="21px"
          size="9"
          :src="icon"
        />
      </v-col>
      <v-col style="margin: 0px 4px">
        <span :class="colorClass">
          {{ name }} {{ updatedAtStr }}
        </span>
      </v-col>
    </v-row>
    <v-row v-if="message">
      <v-col :class="colorClass">
        {{ message }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { MODERATION_STATUS_ENUM } from '@/models/enums'

  export default {
    name: 'ModerationStatusLabel',
    props: {
      status: {
        type: String,
        required: true,
      },
      updatedAt: {
        type: String,
        default: undefined,
      },
      message: {
        type: String,
        default: undefined,
      },
    },
    computed: {
      updatedAtStr () {
        return this.updatedAt ? this.$moment.utc(this.updatedAt).local().format(this.$config.date.DATETIME_FORMAT_MIN2) : ''
      },
      statusEnum () {
        return MODERATION_STATUS_ENUM.find(this.status)
      },
      icon () {
        return this.statusEnum.icon
      },
      colorClass () {
        return `${this.statusEnum.color}--text`
      },
      name () {
        return this.statusEnum.name
      },

    },
  }
</script>
