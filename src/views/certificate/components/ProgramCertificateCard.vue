<template lang="">
  <v-container
    fluid
    class="program-cert-block"
    @click="blockClick()"
  >
    <v-row>
      <v-col>
        <span>{{name}}</span>
        <v-btn>Status</v-btn>
      </v-col>
      <v-spaser />
      <v-col>
        <v-btn> <v-icon>fa-plus</v-icon> </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>{{name}}</v-col>
    </v-row>
    <v-row>
      <v-col>  <v-switch
      v-model="active"
      label="Опубликован"
    ></v-switch></v-col>
    </v-row>
    <v-row>
      <v-col>        
        <v-chip label close>sdfsdf</v-chip>
        <v-btn>plus</v-btn>

      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    props: {
      name: {
        type: String,
        default: '',
      },
      active: {
        type: Boolean,
        default: false,
      },      
    },
    methods: {
      
    },

  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.program-cert-block {
  // max-width: 502px;
  background: $neutral-100;
  border: 1px solid #F2F2F7;
  box-shadow: 0px 7px 20px rgba(88, 93, 106, 0.1);
  border-radius: 10px;
  padding: 10px;
  .settings-block--content , .settings-block--chevron {
    margin-top: 2px;
  }
}
</style>
