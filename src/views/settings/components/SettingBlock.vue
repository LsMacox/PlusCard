<template>
  <v-container
    fluid
    class="settings-block"
    @click="blockClick()"
  >
    <v-row class="ma-0">
      <v-col cols="auto">
        <v-img 
          :src="icon"
          height="47"
          width="47"
          eager
        />
      </v-col>
      <v-col class="settings-block--content">
        <v-row>
          <v-col class="body-l-semibold neutral-900--text">
            {{ title }}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="body-m-regular neutral-700--text">
            {{ description }}
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="auto"
        class="settings-block--chevron"
      >
        <v-icon color="primary">
          mdi-chevron-right
        </v-icon>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    props: {
      icon: {
        type: [String, Object],
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: '',
      },
      to: {
        type: String,
        default: '',
      },
    },
    methods: {
      blockClick () {
        if (this.to) this.$router.push(this.to)
        this.$emit('click')
      },
    },

  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.settings-block {
  // max-width: 502px;
  background: $neutral-100;
  border: 1px solid #F2F2F7;
  box-shadow: 0px 7px 20px rgba(88, 93, 106, 0.1);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  .settings-block--content , .settings-block--chevron {
    margin-top: 2px;
  }
}
</style>
