<template>
  <v-container>
    <v-row><v-col><span class="body-l-semibold">Версия: {{ $config.app.version }}</span></v-col> </v-row>
    <v-row><v-col><span class="body-l-semibold">API: {{ $config.app.apiHost }}</span></v-col> </v-row>
    <v-row>
      <v-col>
        <v-skeleton-loader
          boilerplate
          type="card-avatar, article, actions"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {

  }
</script>
