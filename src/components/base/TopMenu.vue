<template>
  <div class="form-menu">
    <v-row no-gutters>
      <v-col :cols="3">
        <v-btn
          v-if="showCancel"
          class="form-menu__button-cancel body-s-semibold"
          :text="true"
          :ripple="false"
          @click="cancel"
        >
          <v-icon>$iconify_ion-close-circle-outline</v-icon>
          <span>{{ cancelButtonText }}</span>
        </v-btn>
      </v-col>

      <v-col :cols="6">
        <div class="form-menu__item-block">
          <div
            v-for="(item, i) in menu"
            :key="i"
            :class="getActiveClass(item.route)"
            @click="toRoute(item.route)"
          >
            {{ item.name }}
          </div>
        </div>
      </v-col>

      <v-col
        :cols="3"
        style="text-align: right;"
      >
        <v-btn
          v-if="showAction"
          class="form-menu__button-action body-s-semibold"
          :text="true"
          :ripple="false"
          :loading="loading"
          @click="action"
        >
          <v-icon>$iconify_ion-checkmark-circle-outline</v-icon>
          <span>{{ actionButtonText }}</span>
        </v-btn>
      </v-col>
    </v-row>
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
      showCancel: {
        type: Boolean,
        default: true,
      },
      cancelButtonText: {
        type: String,
        default: 'Отменить',
      },
      showAction: {
        type: Boolean,
        default: true,
      },
      actionButtonText: {
        type: String,
        default: 'Сохранить',
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {

      }
    },
    methods: {
      getActiveClass (path) {
        if (this.$route.path === path) return 'form-menu__item-active body-m-medium'
        return 'form-menu__item body-m-medium'
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

    .form-menu__button-cancel {
      display: inline-flex;
      align-items: center;
      color: #B5B5C4;
      cursor: pointer;

      span {
        margin: 4px 0 0 5px;
      }
    }

    .form-menu__button-action {
      display: inline-flex;
      align-items: center;
      color: #4776E6;
      cursor: pointer;

      span {
        margin: 4px 0 0 5px;
      }
    }

    .form-menu__item-block {
      display: flex;
      align-items: center;
      margin: 0 -10px;

      .form-menu__item {
        color: #B5B5C4;
        margin: 0 10px;
        padding: 0 0 6px 0;
        border-bottom: 2px solid #FFFFFF;
        cursor: pointer;
      }

      .form-menu__item-active {
        color: #4776E6;
        margin: 0 10px;
        padding: 0 0 6px 0;
        border-bottom: 2px solid #4776E6;
        cursor: pointer;
      }
    }
  }
</style>
