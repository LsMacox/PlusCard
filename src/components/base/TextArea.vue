<template>
  <div
    class="base-textarea"
  >
    <v-textarea
      outlined
      auto-grow
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-slot:prepend>
        <slot name="prepend" />
      </template>
      <template v-slot:append>
        <slot name="append" />
      </template>
      <template v-slot:append-outer>
        <slot name="append-outer" />
      </template>
      <template v-slot:progress>
        <slot name="progress" />
      </template>
      <template v-slot:prepend-inner>
        <div class="textarea---angle" />
        <slot name="prepend-inner" />
      </template>
    </v-textarea>
  </div>
</template>

<script>
  export default {
    props: {},
    computed: {},
    mounted () {},
  }
</script>

<style lang="scss">
@import '@/styles/vuetify-preset-plus/light_theme/_variables.sass';
@import '@/styles/_typography.sass';

.base-textarea {
  position: relative;
  width: 100%;
  .v-input__slot {
    position: relative !important;
    .v-input__prepend-inner {
      position: absolute !important;
      bottom: 10px !important;
      right: 0px !important;
    }
    .v-text-field__slot {
      textarea {
        color: $neutral-900;
        @include body-m-medium;
      }
    }
  }
  .textarea---angle {
      width: 13px;
      height: 1.4px;
      background: $neutral-500;
      transform: rotate(139deg);
      border-radius: 50px;
      z-index: 22;

      &:before {
          content: "";
          position: absolute;
          width: 7px;
          height: 1.4px;
          margin-top: -4px;
          margin-left: 2.5px;
          border-radius: 10px;
          background: $neutral-500;
      }
  }
}

</style>
