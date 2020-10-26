<template>
  <v-navigation-drawer
    v-model="dialog"
    class="cert-details"
    fixed
    right
    temporary
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
      <v-row  class="dialog-body_title">
        <v-col class="title-m-bold" v-if="title">
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
    },
    data () {
      return {

      }
    },
    computed: {},
    mounted () {

    },
    methods: {

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
