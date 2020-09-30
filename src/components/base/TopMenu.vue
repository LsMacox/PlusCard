<template>
  <v-row no-gutters>
    <v-row
      class="form-menu"
      no-gutters
    >
      <v-col>
        <v-row no-gutters>
          <v-col :cols="3">
            <v-btn
              v-if="showCancel"
              class="form-menu__button-cancel"
              :text="true"
              :ripple="false"
              color="neutral-500"
              @click="cancel"
            >
              <v-icon left>
                $iconify_ion-close-circle-outline
              </v-icon>
              <span class="">{{ cancelButtonText }}</span>
            </v-btn>
          </v-col>

          <v-col :cols="6">
            <div class="form-menu__item-block">
              <div
                v-for="(item, index) in menu"
                :key="index"
                :class="getItemClass(index)"
                @click="menuItemClick(index)"
              >
                {{ item.name }}
              </div>
            </div>
          </v-col>
          <v-col :cols="3">
            <v-row
              justify="end"
              no-gutters
            >
              <v-btn
                v-if="showAction"
                class="form-menu__button-action"
                :text="true"
                :ripple="false"
                :loading="loading"
                color="primary"
                @click="action"
              >
                <v-icon left>
                  $iconify_ion-checkmark-circle-outline
                </v-icon>
                <span>{{ actionButtonText }}</span>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
        <v-row
          v-if="true"
          class="top-menu__divider-row"
          
          no-gutters
        >
          <v-divider  class="top-menu__divider"/>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <slot />
    </v-row>
  </v-row>
</template>

<script>
  import Routing from '@/mixins/routing'

  export default {
    name: 'TopMenu',
    mixins: [Routing],
    model: {
      prop: 'value',
      event: 'change',
    },
    props: {
      menu: {
        type: Array,
        default: () => [],
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
      value: {
        type: Number,
        default: 0,
      },
    },
    data () {
      return {
        internalValue: this.value,
      }
    },
    computed: {
      // internalValue: {
      //   get () {
      //     return this.value
      //   },
      //   set (val) {
      //     if (val === this.value) return

      //     this.$emit('change', val)
      //   },
      // },
    },
    watch: {
      value (index) {
        // console.log('change value', index)
        if (index !== this.internalValue) this.internalValue = index
      },
      internalValue (index, oldIndex) {
        // console.log('internalValue', index, oldIndex)
        if (this.value !== index) this.$emit('change', index)
        const item = this.menu[index]
        if (item.route) {
          console.log('push', item.route)
          this.$router.replace(item.route)
          // this.toRoute(item.route)
        }
      },
    },
    methods: {
      menuItemClick (index) {
        // console.log('menuItemClick', index)
        this.internalValue = index
      },
      getItemClass (index) {
        return index === this.internalValue
          ? 'form-menu__item-active body-m-medium'
          : 'form-menu__item body-m-medium'
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
@import "@/styles/variables.scss";

.form-menu {
  position: sticky;
  top: 0;
  width: 100%;
  margin-top: -$page-content-padding-size;
  margin-left: -$page-content-padding-size;
  margin-right: -$page-content-padding-size;

  padding-top: calc( #{ $page-content-padding-size } + 5px);
  padding-left: $page-content-padding-size;
  padding-right: $page-content-padding-size;
  // margin: $page-content-padding-disable;
  // padding: $page-content-padding;
  background: $material-light-backgroung-color;
  z-index: 200;
  // margin: -34px -34px 0 -34px;
  // padding: 42px 34px;

  // .form-menu__button-cancel {
  //   display: inline-flex;
  //   align-items: center;
  //   color: #B5B5C4;
  //   cursor: pointer;

  //   span {
  //     margin: 4px 0 0 5px;
  //   }
  // }

  // .form-menu__button-action {
  //   display: inline-flex;
  //   align-items: center;
  //   color: #4776E6;
  //   cursor: pointer;

  //   span {
  //     margin: 4px 0 0 5px;
  //   }
  // }

  .form-menu__item-block {
    display: flex;
    align-items: center;
    margin: 0 -10px;

    .form-menu__item {
      color: #b5b5c4;
      margin: 0 10px;
      padding: 0 0 6px 0;
      border-bottom: 2px solid #ffffff;
      cursor: pointer;
    }

    .form-menu__item-active {
      color: #4776e6;
      margin: 0 10px;
      padding: 0 0 6px 0;
      border-bottom: 2px solid #4776e6;
      cursor: pointer;
    }
  }
  .top-menu__divider-row{
     margin-top: 30px;
  margin-left: -$page-content-padding-size;
  margin-right: -$page-content-padding-size;
  }
}
</style>
