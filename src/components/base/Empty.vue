<template>
  <div class="b-empty">
    <div class="b-empty__img">
      <img
        src="@/assets/png/loyalty-dummy.png"
        alt=""
      >
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
        img {
            width: 186px;
            height: 156px;
            max-width: 100%;
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
