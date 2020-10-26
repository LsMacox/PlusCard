<template>
  <div class="b-empty">
    <div class="b-empty__img">
      <v-img
        class="dummy-screen-img"
        :width="186"
        :height="156"
        max-width="100%"
        src="@/assets/png/loyalty-dummy.png"
        alt=""
      />
    </div>
    <div class="b-empty__text">
      <p class="b-empty__text-title title-s-bold">
        Здесь пока ничего нет :’(
      </p>
      <p
        v-if="subText"
        class="b-empty__text-sub-title body-m-regular"
      >
        {{ subText }}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Empty',
    props: {
      subText: {
        type: String,
        default: '',
      },
    },
    mounted () {},
  }
</script>

<style lang="scss" scoped>

@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

.b-empty {
  text-align: center;
  p {
    margin-bottom: 0;
  }
  .b-empty__img {
    .dummy-screen-img {
      margin: 0 auto;
    }
  }
  .b-empty__text {
    margin-top: 34px;
    text-align: center;
    p {
      &.b-empty__text-title {
        color: $neutral-900
      }
      &.b-empty__text-sub-title {
        margin-top: 12px;
        white-space: pre-line;
        color: $neutral-700
      }
    }
  }
}

</style>
