<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(icon, index) in icons"
        :key="index"
        cols="2"
      >
        <v-row align="center">
            <v-icon>{{ icon.name }}</v-icon>
          <v-col>{{ icon.name }}</v-col>
          
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

  import { ICONIFY_ICONS } from '@/plugins/iconify'
  import { CUSTOM_ICONS } from '@/plugins/icons'

  export default {
    computed: {
      icons () {
        const list = []
        for (const icon in ICONIFY_ICONS) {
          list.push({
            name: `$iconify_${icon}`,
          })
        }
        for (const icon in CUSTOM_ICONS) {
          list.push({
            name: `$icons_${icon}`,
          })
        }
        return list
      },
    },
  }
</script>
