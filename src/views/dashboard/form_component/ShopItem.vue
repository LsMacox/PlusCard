<template>
  <div>
    <shop-card
      v-if="index !== shopIndex"
      :item="item"
      @open="shopIndex = index"
    />
    <shop-form
      v-else
      :save="save"
      @close="shopIndex = -2"
      @save="(e) => $emit('save', e)"
    />
  </div>
</template>

<script>
  import ShopCard from '@/views/dashboard/form_component/ShopCard'
  import ShopForm from '@/views/dashboard/form_component/ShopForm'

  export default {

    components: {
      ShopCard,
      ShopForm,
    },
    props: {
      item: {
        type: Object,
        default: {},
      },
      index: {
        type: Number,
        default: -2,
      },
      save: {
        type: Boolean,
        default: true,
      },
    },
    data () {
      return {}
    },
    computed: {
      shopIndex: {
        get () {
          return this.$store.getters['company/program/shopIndex']
        },
        set (v) {
          this.$store.commit('company/program/SET_SHOP_INDEX', v)
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-component.scss';
</style>
