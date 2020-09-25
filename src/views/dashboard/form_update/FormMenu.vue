<template>
  <div class="form-menu">
    <v-btn
      class="form-menu__button"
      :text="true"
      :ripple="false"
    >
      <v-icon>$iconify_ion-close-circle-outline</v-icon>
      {{ cancelButtonText }}
    </v-btn>

    <div
      v-for="(item, i) in menu"
      :key="i"
      class="form-menu__item body-m-medium"
      :style="'color: ' + getCurrentColor('first')+ ';cursor: pointer;'"
      @click="toRoute(item.route)"
    >
      {{ item.name }}
    </div>

    <v-btn
      class="form-menu__button"
      color="secondary"
      :text="true"
      :ripple="false"
    >
      <v-icon>$iconify_ion-checkmark-circle-outline</v-icon>
      {{ actionButtonText }}
    </v-btn>
  </div>
</template>

<script>
  import Routing from '@/mixins/routing'

  export default {
    mixins: [Routing],
    props: {
      menu: {
        type: Array,
        default: [],
      },
      cancelButtonText: {
        type: String,
        default: 'Отменить',
      },
      actionButtonText: {
        type: String,
        default: 'Сохранить',
      },
    },
    data () {
      return {

      }
    },
    methods: {
      getCurrentColor () {
        //
      },
      cancel () {
        this.$emit('cancelbutton')
      },
      action () {
        this.$emit('actionbutton')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .form-menu {
    margin: -34px -34px 0 -34px;
    padding: 42px 34px;
    display: flex;
    align-items: center;

    .form-menu__button {}

    .form-menu__item {}
  }
</style>
