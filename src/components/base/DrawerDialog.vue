<template>
  <v-navigation-drawer
    v-model="dialog"
    class="base-drawer-dialog"
    fixed
    right
    temporary
    :stateless="stateless"
    :width="width"
  >
    <template v-slot:prepend>
      <v-row
        no-gutters
        class="dialog-header"
      >
        <v-btn
          text
          color="primary"
          @click="close()"
        >
          <v-icon left>
            $iconify_arrow-left
          </v-icon>  Назад
        </v-btn>

        <v-spacer />
        <slot name="action" />
      </v-row>
    </template>

    <v-container class="dialog-body">
      <v-row class="dialog-body_title">
        <v-col
          v-if="title"
          class="title-m-bold"
        >
          {{ title }}
        </v-col>
        <v-col v-else-if="$slots.title">
          <slot name="title" />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>

  import dialogable from '@/mixins/dialogable.js'

  export default {
    components: {},
    mixins: [dialogable],
    props: {
      width: {
        type: [Number, String],
        default: 500,
      },
      title: {
        type: String,
        default: '',
      },
      stateless: Boolean,

    },
    data () {
      return {

      }
    },
    computed: {},
    mounted () {
      window.addEventListener('keyup', this.onKeyUp)
    },
    beforeDestroy () {
      window.removeEventListener('keyup', this.onKeyUp)
    },
    methods: {
      onKeyUp (e) {
        console.log('onKeyUp', e)
        if (e.key === 'Escape') {
          this.close()
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.dialog-header{
  padding: 34px;
}
.dialog-body {
  padding: 0px 34px 34px 34px;

}

</style>
